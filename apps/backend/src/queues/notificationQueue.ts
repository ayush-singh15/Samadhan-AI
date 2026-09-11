import { Queue, Worker } from 'bullmq';
import { env } from '../config/env.config';

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
};

export const notificationQueue = new Queue('notification-dispatcher', { connection });

export const notificationWorker = new Worker(
  'notification-dispatcher',
  async (job) => {
    console.log(`[BullMQ] Dispatching email/SMS notification to user ${job.data.userId}: ${job.data.title}`);
    return { status: 'DISPATCHED' };
  },
  { connection }
);
