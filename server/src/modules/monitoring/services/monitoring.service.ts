import { getRepository } from 'typeorm';
import { Log } from '../entities/log.entity';
import { LogEntry, LogStats } from '../../../shared/types/logging';

export class MonitoringService {
  private logRepository = getRepository(Log);

  async logRequest(entry: Omit<LogEntry, 'id'>): Promise<void> {
    const log = this.logRepository.create(entry);
    await this.logRepository.save(log);
  }

  async getStats(startDate: Date, endDate: Date): Promise<LogStats> {
    const logs = await this.logRepository
      .createQueryBuilder('log')
      .where('log.timestamp BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();

    const stats: LogStats = {
      totalRequests: logs.length,
      successCount: logs.filter(log => log.statusCode && log.statusCode < 400).length,
      errorCount: logs.filter(log => log.statusCode && log.statusCode >= 400).length,
      averageResponseTime: logs.reduce((acc, log) => acc + (log.duration || 0), 0) / logs.length,
      errorRates: {},
      requestsByEndpoint: {},
      requestsByMethod: {}
    };

    logs.forEach(log => {
      if (log.path) {
        stats.requestsByEndpoint[log.path] = (stats.requestsByEndpoint[log.path] || 0) + 1;
      }
      if (log.method) {
        stats.requestsByMethod[log.method] = (stats.requestsByMethod[log.method] || 0) + 1;
      }
      if (log.statusCode && log.statusCode >= 400) {
        const errorKey = `${log.statusCode}`;
        stats.errorRates[errorKey] = (stats.errorRates[errorKey] || 0) + 1;
      }
    });

    return stats;
  }

  async getLogs(
    startDate: Date,
    endDate: Date,
    filters: {
      level?: 'info' | 'warn' | 'error';
      statusCode?: number;
      path?: string;
      method?: string;
    }
  ): Promise<LogEntry[]> {
    const query = this.logRepository
      .createQueryBuilder('log')
      .where('log.timestamp BETWEEN :startDate AND :endDate', { startDate, endDate });

    if (filters.level) {
      query.andWhere('log.level = :level', { level: filters.level });
    }
    if (filters.statusCode) {
      query.andWhere('log.statusCode = :statusCode', { statusCode: filters.statusCode });
    }
    if (filters.path) {
      query.andWhere('log.path LIKE :path', { path: `%${filters.path}%` });
    }
    if (filters.method) {
      query.andWhere('log.method = :method', { method: filters.method });
    }

    return query.orderBy('log.timestamp', 'DESC').getMany();
  }
}
