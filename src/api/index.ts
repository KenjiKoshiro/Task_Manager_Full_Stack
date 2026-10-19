const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const parseError = async (response: Response, fallbackMessage: string) => {
  try {
    const error = await response.json();
    return error.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

const request = async (
  url: string,
  init: RequestInit = {},
  fallbackMessage: string,
) => {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(60000),
    });
  } catch (error) {
    throw new ApiError(
      error instanceof Error && error.name === "TimeoutError"
        ? "The server is taking too long. Please retry; your session has been kept."
        : "Unable to reach the server. Check your connection and retry.",
      0,
    );
  }

  if (!response.ok) {
    throw new ApiError(
      await parseError(response, fallbackMessage),
      response.status,
    );
  }

  return response;
};

const safeJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    throw new ApiError(
      "The server returned an unreadable response. Please retry.",
      502,
    );
  }
};

const transformTask = (task: any) => ({
  id: task._id || task.id,
  title: task.title,
  description: task.description || "",
  status: task.status,
  priority: task.priority,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
  dueDate: task.dueDate ?? null,
  tag: task.tag ?? "",
});

const transformUser = (user: any) => ({
  id: user._id || user.id,
  email: user.email,
  name: user.name,
  createdAt: user.createdAt,
});

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  auth: {
    async register(data: { email: string; password: string; name: string }) {
      const response = await request(
        `${API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        "Registration failed",
      );

      const result = await safeJson(response);

      if (!result?.token || !result.user?.email)
        throw new ApiError("Invalid sign-in response. Please retry.", 502);
      return {
        token: result.token,
        user: transformUser(result?.user),
      };
    },

    async login(data: { email: string; password: string }) {
      const response = await request(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        "Login failed",
      );

      const result = await safeJson(response);

      if (!result?.token || !result.user?.email)
        throw new ApiError("Invalid sign-in response. Please retry.", 502);
      return {
        token: result.token,
        user: transformUser(result?.user),
      };
    },

    async me() {
      const response = await request(
        `${API_BASE_URL}/auth/me`,
        {
          headers: { ...getAuthHeaders() },
        },
        "Failed to restore session",
      );

      const user = await safeJson(response);
      return transformUser(user);
    },
  },

  tasks: {
    async getAll() {
      const response = await request(
        `${API_BASE_URL}/tasks`,
        {
          headers: { ...getAuthHeaders() },
        },
        "Failed to fetch tasks",
      );

      const tasks = await safeJson(response);
      if (!Array.isArray(tasks))
        throw new ApiError(
          "The task list could not be read. Please retry.",
          502,
        );
      return tasks.map(transformTask);
    },

    async create(data: {
      title: string;
      description?: string;
      status?: string;
      priority?: string;
      dueDate?: string | null;
      tag?: string;
    }) {
      const response = await request(
        `${API_BASE_URL}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(data),
        },
        "Failed to create task",
      );

      const task = await safeJson(response);
      return transformTask(task);
    },

    async update(
      id: string,
      data: {
        title?: string;
        description?: string;
        status?: string;
        priority?: string;
        dueDate?: string | null;
        tag?: string;
      },
    ) {
      const response = await request(
        `${API_BASE_URL}/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(data),
        },
        "Failed to update task",
      );

      const task = await safeJson(response);
      return transformTask(task);
    },

    async delete(id: string) {
      const response = await request(
        `${API_BASE_URL}/tasks/${id}`,
        {
          method: "DELETE",
          headers: { ...getAuthHeaders() },
        },
        "Failed to delete task",
      );

      return safeJson(response);
    },
  },
};

export default api;
