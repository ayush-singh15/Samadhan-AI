import { prisma } from '../../config/db.config';
import { notificationQueue } from '../../queues/notificationQueue';

export class NotificationsService {
  async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async sendTriggerNotification(userId: string, title: string, message: string, type: string = 'SYSTEM') {
    // 1. Persist notification to Neon DB
    const notif = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        isRead: false,
      },
    });

    // 2. Try to dispatch to background worker queue (safe fallback)
    try {
      await notificationQueue.add('send-notification', { notifId: notif.id, userId, title, message });
    } catch {
      // safe fallback if Redis is offline
    }

    return notif;
  }
}

export const notificationsService = new NotificationsService();
