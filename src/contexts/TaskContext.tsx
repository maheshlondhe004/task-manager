import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useToast } from '@chakra-ui/react';
import api from '../services/api';
import type {
  Task,
  TaskContextValue,
  TaskState,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskFilters,
} from './TaskContext.types';
import type { PaginatedResponse, ApiResponse } from '../types/api.types';
import { TaskContext } from './TaskContext.context';

// Task context provider component
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TaskState>({
    tasks: [],
    selectedTask: null,
    isLoading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    }
  });

  const toast = useToast();

  const fetchTasks = useCallback(async (filters?: TaskFilters): Promise<PaginatedResponse<Task>> => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data } = await api.get<PaginatedResponse<Task>>('/tasks', { params: filters });
      setState(prev => ({
        ...prev,
        tasks: data.data,
        pagination: {
          total: data.total,
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages
        },
        error: null
      }));
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setState(prev => ({ ...prev, error: errorMessage }));
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw err;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [toast]);

  const createTask = useCallback(async (taskData: CreateTaskDTO): Promise<ApiResponse<Task>> => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data } = await api.post<ApiResponse<Task>>('/tasks', taskData);
      setState(prev => ({
        ...prev,
        tasks: [...prev.tasks, data.data],
        error: null
      }));
      toast({
        title: 'Success',
        description: 'Task created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setState(prev => ({ ...prev, error: errorMessage }));
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw err;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [toast]);

  const updateTask = useCallback(async (id: string, updates: UpdateTaskDTO): Promise<ApiResponse<Task>> => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data } = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, updates);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => task.id === id ? data.data : task),
        error: null
      }));
      toast({
        title: 'Success',
        description: 'Task updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setState(prev => ({ ...prev, error: errorMessage }));
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw err;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [toast]);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await api.delete(`/tasks/${id}`);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== id),
        error: null
      }));
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setState(prev => ({ ...prev, error: errorMessage }));
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw err;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [toast]);

  const selectTask = useCallback((task: Task | null) => {
    setState(prev => ({ ...prev, selectedTask: task }));
  }, []);

  const assignTask = useCallback(async (taskId: string, userId: string): Promise<ApiResponse<Task>> => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data } = await api.post<ApiResponse<Task>>(`/tasks/${taskId}/assign`, { userId });
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => task.id === taskId ? data.data : task),
        error: null
      }));
      toast({
        title: 'Success',
        description: 'Task assigned successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign task';
      setState(prev => ({ ...prev, error: errorMessage }));
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw err;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [toast]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const value: TaskContextValue = {
    tasks: state.tasks,
    selectedTask: state.selectedTask,
    isLoading: state.isLoading,
    pagination: state.pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    selectTask,
    assignTask,
    clearError
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
