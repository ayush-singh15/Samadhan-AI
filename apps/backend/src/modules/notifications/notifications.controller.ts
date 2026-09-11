import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { notificationsService } from './notifications.service';
import { sendResponse } from '../../utils/response';

export class NotificationsController {
  async getNotifications(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id || 'usr-citizen-01';
    const list = await notificationsService.getUserNotifications(userId);
    return sendResponse(res, 200, true, 'Notifications fetched', list);
  }

  async triggerNotification(req: AuthenticatedRequest, res: Response) {
    const { userId, title, message } = req.body;
    const result = await notificationsService.sendTriggerNotification(userId, title, message);
    return sendResponse(res, 200, true, 'Notification trigger queued', result);
  }
}

export const notificationsController = new NotificationsController();
