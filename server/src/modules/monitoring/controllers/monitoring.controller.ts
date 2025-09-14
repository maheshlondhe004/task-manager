import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from '../services/monitoring.service';
import { AppError } from '../../../shared/middleware/errorHandler';

const monitoringService = new MonitoringService();

export const getSystemHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return next(new AppError(403, 'Access forbidden. Admin only.'));
    }

    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const stats = await monitoringService.getStats(dayStart, now);

    res.json({
      status: 'healthy',
      timestamp: new Date(),
      version: process.env.npm_package_version || '1.0.0',
      stats
    });
  } catch (error) {
    next(new AppError(500, 'Error fetching system health'));
  }
};

export const getLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return next(new AppError(403, 'Access forbidden. Admin only.'));
    }

    const { startDate, endDate, level, statusCode, path, method } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const logs = await monitoringService.getLogs(start, end, {
      level: level as 'info' | 'warn' | 'error',
      statusCode: statusCode ? parseInt(statusCode as string, 10) : undefined,
      path: path as string,
      method: method as string
    });

    res.json(logs);
  } catch (error) {
    next(new AppError(500, 'Error fetching logs'));
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return next(new AppError(403, 'Access forbidden. Admin only.'));
    }

    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const stats = await monitoringService.getStats(start, end);
    res.json(stats);
  } catch (error) {
    next(new AppError(500, 'Error fetching statistics'));
  }
};
