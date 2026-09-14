import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { notificationsService } from './notifications.service';
import { sendResponse } from '../../utils/response';

export class NotificationsController {
  async getNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendResponse(res, 401, false, 'Unauthorized');

      const list = await notificationsService.getUserNotifications(userId);
      return sendResponse(res, 200, true, 'Notifications fetched successfully', list);
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  }

  async markAsRead(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendResponse(res, 401, false, 'Unauthorized');

      const { id } = req.params;
      await notificationsService.markAsRead(id, userId);
      return sendResponse(res, 200, true, 'Notification marked as read');
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }

  async markAllAsRead(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendResponse(res, 401, false, 'Unauthorized');

      await notificationsService.markAllAsRead(userId);
      return sendResponse(res, 200, true, 'All notifications marked as read');
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  }

  async triggerNotification(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId, title, message, type } = req.body;
      if (!userId || !title || !message) {
        return sendResponse(res, 400, false, 'userId, title, and message are required');
      }
      const result = await notificationsService.sendTriggerNotification(userId, title, message, type);
      return sendResponse(res, 201, true, 'Notification created & queued', result);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }
}

export const notificationsController = new NotificationsController();
