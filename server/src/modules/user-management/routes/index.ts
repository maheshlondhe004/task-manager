import { Router } from 'express';
import { register, login, getProfile, getAllUsers } from '../controllers/user.controller';
import { auth, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.get('/', auth, authorize('ADMIN'), getAllUsers);

export const userRoutes = router;
