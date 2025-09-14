import { Router } from 'express';
import { authenticateToken } from '../../../config/auth';

const router = Router();

// Add your task routes here
// Example:
// router.get('/', authenticateToken, listTasks);
// router.post('/', authenticateToken, createTask);
// router.put('/:id', authenticateToken, updateTask);
// router.delete('/:id', authenticateToken, deleteTask);

export default router;
