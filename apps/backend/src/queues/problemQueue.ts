// Problem Queue — active only when Redis URL or ENABLE_REDIS is set
let problemQueue: any = { add: async () => {} };

if (process.env.REDIS_URL || process.env.ENABLE_REDIS === 'true') {
  try {
    const { Queue } = require('bullmq');
    const { env } = require('../config/env.config');
    const connection = process.env.REDIS_URL
      ? { url: process.env.REDIS_URL }
      : { host: env.REDIS_HOST, port: env.REDIS_PORT, maxRetriesPerRequest: null, connectTimeout: 1000 };
    problemQueue = new Queue('problem-processing', { connection });
    console.log('✅ Problem queue connected to Redis');
  } catch (err: any) {
    console.warn('⚠️ Problem queue initialization skipped:', err.message);
  }
} else {
  console.log('ℹ️ Redis not configured — problem queue in fast no-op mode');
}

export { problemQueue };
