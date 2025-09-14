export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type WithPagination<T> = {
  pagination?: {
    page?: number;
    limit?: number;
    sortBy?: keyof T;
    sortOrder?: 'asc' | 'desc';
  };
};
