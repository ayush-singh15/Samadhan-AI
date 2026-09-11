import { Queue, Worker } from 'bullmq';
import { env } from '../config/env.config';

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
};

export const problemQueue = new Queue('problem-categorization', { connection });

export const problemWorker = new Worker(
  'problem-categorization',
  async (job) => {
    console.log(`[BullMQ] Processing async AI categorization for problem ID: ${job.data.problemId}`);
    // Simulate async call to FastAPI AI microservice
    return { status: 'COMPLETED', category: job.data.category || 'INFRASTRUCTURE' };
  },
  { connection }
);
