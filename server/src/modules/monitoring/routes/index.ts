import { Router } from 'express';
import { auth, authorize } from '../../user-management/middleware/auth.middleware';
import { getSystemHealth, getLogs, getStats } from '../controllers/monitoring.controller';

const router = Router();

router.use(auth, authorize('ADMIN'));

router.get('/health', getSystemHealth);
router.get('/logs', getLogs);
router.get('/stats', getStats);

export const monitoringRoutes = router;
