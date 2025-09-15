import express from 'express';
import { createConnection } from 'typeorm';
import cors from 'cors';
import helmet from 'helmet';
import { configureRoutes } from './routes';
import { errorHandler } from './shared/middleware/errorHandler';
import { setupLogger } from './shared/utils/logger';
import { dbConfig } from './config/database';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();
const PORT = process.env.PORT || 3000;

// Setup logging
const logger = setupLogger();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(express.json());

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

// Configure routes
configureRoutes(app);

// Swagger docs (cast to any to avoid express type mismatch across workspaces)
app.use('/api-docs', ...(swaggerUi.serve as unknown as any[]), swaggerUi.setup(swaggerSpec) as any);
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Error handling middleware
app.use(errorHandler);

// Database connection and server startup
async function initializeApp() {
  let retries = 5;
  const retryDelay = 5000;

  while (retries > 0) {
    try {
      const connection = await createConnection(dbConfig);
      logger.info('Database connection established');
      
      app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });
      return;
    } catch (error) {
      retries -= 1;
      if (retries === 0) {
        logger.error('Failed to connect to database after multiple retries:', error);
        process.exit(1);
      }
      logger.info(`Retrying database connection in ${retryDelay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

initializeApp().catch(error => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
