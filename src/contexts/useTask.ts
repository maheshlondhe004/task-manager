import { useContext } from 'react';
import { TaskContext } from './TaskContext';
import type { TaskContextType } from './TaskContext.types';

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
