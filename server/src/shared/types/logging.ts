export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  path?: string;
  method?: string;
  statusCode?: number;
  userId?: string;
  userRole?: string;
  duration?: number;
  error?: string;
  stack?: string;
}

export interface LogStats {
  totalRequests: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  errorRates: {
    [key: string]: number;
  };
  requestsByEndpoint: {
    [key: string]: number;
  };
  requestsByMethod: {
    [key: string]: number;
  };
}
