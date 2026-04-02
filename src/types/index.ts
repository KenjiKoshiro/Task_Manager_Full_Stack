// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

// Task types
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}