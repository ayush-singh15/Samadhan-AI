// Notification Queue — gracefully disabled if Redis is not available
let notificationQueue: any = { add: async () => {} };

try {
  const { Queue } = require('bullmq');
  const { env }   = require('../config/env.config');
  const connection = { host: env.REDIS_HOST, port: env.REDIS_PORT };
  notificationQueue = new Queue('notifications', { connection });
  console.log('✅ Notification queue connected to Redis');
} catch {
  console.warn('⚠️  Redis not available — notification queue running in no-op mode');
}

export { notificationQueue };
