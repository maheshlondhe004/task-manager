import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { AppError } from '../../../shared/middleware/errorHandler';

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskRepository = getRepository(Task);
    const tasks = await taskRepository.find({
      where: { assignedTo: req.user },
      relations: ['assignedTo']
    });

    res.json(tasks);
  } catch (error) {
    next(new AppError(500, 'Error fetching tasks'));
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description } = req.body;
    const taskRepository = getRepository(Task);

    const task = taskRepository.create({
      title,
      description,
      assignedTo: req.user
    });

    await taskRepository.save(task);
    res.status(201).json(task);
  } catch (error) {
    next(new AppError(500, 'Error creating task'));
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const taskRepository = getRepository(Task);

    const task = await taskRepository.findOne({
      where: { id, assignedTo: req.user },
      relations: ['assignedTo']
    });

    if (!task) {
      return next(new AppError(404, 'Task not found'));
    }

    Object.assign(task, updates);
    await taskRepository.save(task);
    res.json(task);
  } catch (error) {
    next(new AppError(500, 'Error updating task'));
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const taskRepository = getRepository(Task);

    const task = await taskRepository.findOne({
      where: { id, assignedTo: req.user }
    });

    if (!task) {
      return next(new AppError(404, 'Task not found'));
    }

    await taskRepository.remove(task);
    res.status(204).send();
  } catch (error) {
    next(new AppError(500, 'Error deleting task'));
  }
};
