import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createConnection } from 'typeorm';
import userRoutes from './modules/users/routes';
import taskRoutes from './modules/tasks/routes';
import { authenticateToken } from './config/auth';

const app = express();

// Configure CORS with credentials support
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:80', 'http://localhost'], // Allow multiple frontend URLs
  credentials: true, // Required for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await createConnection();
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
