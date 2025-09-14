import { type ReactNode } from 'react';
import type { ApiResponse, PaginatedResponse, WithPagination } from '../types/api.types';
import type { User, UserRole } from './AuthContext.types';

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
}

export interface UserFilters extends WithPagination<User> {
  role?: UserRole;
  search?: string;
}

export interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserContextValue extends Omit<UserState, 'error'> {
  fetchUsers: (filters?: UserFilters) => Promise<PaginatedResponse<User>>;
  updateUser: (id: string, updates: UpdateUserDTO) => Promise<ApiResponse<User>>;
  deleteUser: (id: string) => Promise<void>;
  selectUser: (user: User | null) => void;
  assignRole: (userId: string, role: UserRole) => Promise<ApiResponse<User>>;
  clearError: () => void;
}

export interface UserProviderProps {
  children: ReactNode;
}
