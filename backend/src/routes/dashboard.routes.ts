import { Router, Request, Response, NextFunction } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication
router.use(authenticate);

// Get dashboard data
router.get('/data', (req: Request, res: Response, next: NextFunction) =>
  dashboardController.getDashboardData(req, res, next)
);

export default router;
