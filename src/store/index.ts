import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Task } from '../types';
import api, { ApiError } from '../api';

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
        const token = localStorage.getItem('token');

        if (!token) {
          set({ user: null, isAuthenticated: false, isInitialized: true, error: null });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const user = await api.auth.me();
          set({ user, isAuthenticated: true, isInitialized: true, isLoading: false });
        } catch (error) {
          localStorage.removeItem('token');
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            isLoading: false,
            error: error instanceof ApiError && error.status === 401 ? null : (error as Error).message,
          });
        }
      },
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await api.auth.login({ email, password });
          localStorage.setItem('token', token);
          set({ user, isAuthenticated: true, isInitialized: true, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await api.auth.register({ email, password, name });
          localStorage.setItem('token', token);
          set({ user, isAuthenticated: true, isInitialized: true, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false, isInitialized: true, error: null });
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        if (token) localStorage.setItem('token', token);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await api.tasks.getAll();
      set({ tasks, isLoading: false });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        useAuthStore.getState().logout();
      }
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await api.tasks.create(taskData);
      set((state) => ({ 
        tasks: [newTask, ...state.tasks], 
        isLoading: false 
      }));
      return newTask;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        useAuthStore.getState().logout();
      }
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateTask: async (taskId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await api.tasks.update(taskId, updates);
      set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === taskId ? { ...task, ...updatedTask } : task
        ),
        isLoading: false,
      }));
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        useAuthStore.getState().logout();
      }
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    set({ isLoading: true, error: null });
    try {
      await api.tasks.delete(taskId);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        isLoading: false,
      }));
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        useAuthStore.getState().logout();
      }
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
