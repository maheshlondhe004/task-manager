import { useContext } from 'react';
import { TaskContext } from './TaskContext.context';
import type { TaskContextType } from './TaskContext.context';

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
