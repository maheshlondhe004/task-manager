import { DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const dbConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'taskmanager',
  synchronize: process.env.NODE_ENV === 'development',
  logging: true, // Always show SQL queries
  logger: 'advanced-console',
  extra: {
    connectTimeout: 60000 // 60 seconds
  },
  entities: [
    __dirname + '/../modules/**/entities/*.{ts,js}'
  ],
  migrations: [
    __dirname + '/../migrations/*.{ts,js}'
  ],
  subscribers: [
    __dirname + '/../subscribers/*.{ts,js}'
  ]
};
