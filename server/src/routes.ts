import { Express } from 'express';
import { taskRoutes } from './modules/task-management/routes';
import { userRoutes } from './modules/user-management/routes';

export const configureRoutes = (app: Express): void => {
  app.use('/api/tasks', taskRoutes);
  app.use('/api/users', userRoutes);
};
