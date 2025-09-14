import { Router } from 'express';
import { login, register, refreshToken, logout } from '../controllers/user.controller';
import { authenticateToken } from '../../../config/auth';

const router = Router();

// Auth routes
router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticateToken, logout);

export default router;
