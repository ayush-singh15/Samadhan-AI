import Redis from 'ioredis';
import { env } from './env.config';

export const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  lazyConnect: true,
  maxRetriesPerRequest: null,
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.on('error', (err) => {
  console.warn('⚠️ Redis Connection Warning:', err.message);
});
