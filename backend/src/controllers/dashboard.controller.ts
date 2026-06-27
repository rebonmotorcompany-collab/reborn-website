import { Request, Response, NextFunction } from 'express';
import dashboardService from '../services/dashboard.service';

export class DashboardController {
  async getDashboardData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const data = await dashboardService.getDashboardData(req.user.tenantId);

      res.json({
        success: true,
        message: 'Dashboard data retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
