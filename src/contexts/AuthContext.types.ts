import { type ReactNode } from 'react';
import type { ApiResponse } from '../types/api.types';

export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthContextValue extends Omit<AuthState, 'error'> {
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  register: (data: RegisterData) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<ApiResponse<AuthResponse>>;
  clearError: () => void;
  isAdmin: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}
