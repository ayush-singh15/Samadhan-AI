import { notificationQueue } from '../../queues/notificationQueue';

export class NotificationsService {
  private notifications = [
    {
      id: 'notif-1',
      userId: 'usr-citizen-01',
      title: 'Problem Status Updated',
      message: 'Your report "Contaminated Water Tank" has been assigned to IIT Kanpur.',
      type: 'PROBLEM_UPDATE',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  ];

  async getUserNotifications(userId: string) {
    return this.notifications;
  }

  async sendTriggerNotification(userId: string, title: string, message: string) {
    try {
      await notificationQueue.add('send-email', { userId, title, message });
    } catch (e) {
      console.warn('Notification queue fallback');
    }
    return { status: 'QUEUED' };
  }
}

export const notificationsService = new NotificationsService();
