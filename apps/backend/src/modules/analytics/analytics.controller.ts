import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { analyticsService } from './analytics.service';
import { sendResponse } from '../../utils/response';

export class AnalyticsController {
  async getDashboard(req: AuthenticatedRequest, res: Response) {
    const data = await analyticsService.getDashboardAnalytics();
    return sendResponse(res, 200, true, 'Analytics summary retrieved', data);
  }
}

export const analyticsController = new AnalyticsController();
