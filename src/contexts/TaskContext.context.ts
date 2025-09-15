import { createContext } from 'react';
import type { TaskContextValue } from './TaskContext.types';

export const TaskContext = createContext<TaskContextValue | undefined>(undefined);
