import { type ReactNode } from 'react';
import type { ApiResponse, BaseEntity, PaginatedResponse, WithPagination } from '../types/api.types';
import type { User } from './AuthContext.types';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task extends BaseEntity {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedTo: User | null;
  createdBy: User;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  assignedTo?: string;
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
  status?: TaskStatus;
}

export interface TaskFilters extends WithPagination<Task> {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  search?: string;
}

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TaskContextValue extends Omit<TaskState, 'error'> {
  fetchTasks: (filters?: TaskFilters) => Promise<PaginatedResponse<Task>>;
  createTask: (task: CreateTaskDTO) => Promise<ApiResponse<Task>>;
  updateTask: (id: string, updates: UpdateTaskDTO) => Promise<ApiResponse<Task>>;
  deleteTask: (id: string) => Promise<void>;
  selectTask: (task: Task | null) => void;
  assignTask: (taskId: string, userId: string) => Promise<ApiResponse<Task>>;
  clearError: () => void;
}

export interface TaskProviderProps {
  children: ReactNode;
}
