// Problem Queue — gracefully disabled if Redis is not available
let problemQueue: any = { add: async () => {} };

try {
  const { Queue } = require('bullmq');
  const { env }   = require('../config/env.config');
  const connection = { host: env.REDIS_HOST, port: env.REDIS_PORT };
  problemQueue = new Queue('problem-processing', { connection });
  console.log('✅ Problem queue connected to Redis');
} catch {
  console.warn('⚠️  Redis not available — problem queue running in no-op mode');
}

export { problemQueue };
