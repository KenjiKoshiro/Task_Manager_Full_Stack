import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Task } from "../types";
import api, { ApiError } from "../api";
import { shouldClearSession } from "../lib/taskUtils";

let sessionVersion = 0;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,
      isLoading: false,
      error: null,

      initializeAuth: async () => {
        const version = sessionVersion;
        const token = localStorage.getItem("token");

        if (!token) {
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            error: null,
          });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const user = await api.auth.me();
          if (version !== sessionVersion) return;
          set({
            user,
            isAuthenticated: true,
            isInitialized: true,
            isLoading: false,
          });
        } catch (error) {
          if (version !== sessionVersion) return;
          if (shouldClearSession(error)) localStorage.removeItem("token");
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            isLoading: false,
            error:
              error instanceof ApiError && error.status === 401
                ? null
                : (error as Error).message,
          });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await api.auth.login({ email, password });
          sessionVersion++;
          localStorage.setItem("token", token);
          set({
            user,
            isAuthenticated: true,
            isInitialized: true,
            isLoading: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await api.auth.register({
            email,
            password,
            name,
          });
          sessionVersion++;
          localStorage.setItem("token", token);
          set({
            user,
            isAuthenticated: true,
            isInitialized: true,
            isLoading: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        sessionVersion++;
        localStorage.removeItem("token");
        useTaskStore.setState({ tasks: [], error: null, isLoading: false });
        set({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
          error: null,
        });
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        if (token) localStorage.setItem("token", token);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  fetchTasks: () => Promise<void>;
  addTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),

  fetchTasks: async () => {
    const version = sessionVersion;
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const tasks = await api.tasks.getAll();
      if (version !== sessionVersion || token !== localStorage.getItem("token"))
        return;
      set({ tasks, isLoading: false });
    } catch (error) {
      if (version !== sessionVersion) return;
      if (error instanceof ApiError && error.status === 401) {
        useAuthStore.getState().logout();
      }
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addTask: async (taskData) => {
    const version = sessionVersion;
    set({ isLoading: true, error: null });
    try {
      const newTask = await api.tasks.create(taskData);
      if (version !== sessionVersion) return newTask;
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        isLoading: false,
      }));
      return newTask;
    } catch (error) {
      if (version !== sessionVersion) throw error;
      if (error instanceof ApiError && error.status === 401) {
        useAuthStore.getState().logout();
      }
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateTask: async (taskId, updates) => {
    const version = sessionVersion;
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await api.tasks.update(taskId, updates);
      if (version !== sessionVersion) return;
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updatedTask } : task,
        ),
        isLoading: false,
      }));
    } catch (error) {
      if (version !== sessionVersion) return;
      if (error instanceof ApiError && error.status === 401) {
        useAuthStore.getState().logout();
      }
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    const version = sessionVersion;
    set({ isLoading: true, error: null });
    try {
      await api.tasks.delete(taskId);
      if (version !== sessionVersion) return;
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        isLoading: false,
      }));
    } catch (error) {
      if (version !== sessionVersion) return;
      if (error instanceof ApiError && error.status === 401) {
        useAuthStore.getState().logout();
      }
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
