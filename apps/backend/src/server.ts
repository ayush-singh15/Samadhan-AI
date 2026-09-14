import app from './app';
import { env } from './config/env.config';
import { prisma } from './config/db.config';

const primaryPort = process.env.PORT ? parseInt(process.env.PORT, 10) : (env.PORT || 5000);
const HOST = '0.0.0.0';

// Listen on primary port plus fallback ports (5000 & 8080) to prevent any Railway proxy mismatch
const ports = Array.from(new Set([primaryPort, 5000, 8080]));

ports.forEach((p) => {
  app.listen(p, HOST, () => {
    console.log(`🚀 Samadhan AI Backend running on http://${HOST}:${p}`);
    console.log(`📑 Swagger Docs: http://${HOST}:${p}/api-docs`);
  });
});

// Asynchronously connect to Neon database
prisma.$connect()
  .then(() => {
    console.log('✅ Connected to Neon PostgreSQL');
  })
  .catch((err) => {
    console.error('⚠️ Database connection error:', err.message);
  });
