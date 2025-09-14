import { Router } from 'express';
import { auth } from '../../user-management/middleware/auth.middleware';
import { createTask, updateTask, deleteTask, getTasks } from '../controllers/task.controller';

const router = Router();

router.use(auth);

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export const taskRoutes = router;
