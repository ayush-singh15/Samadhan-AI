import app from './app';
import { env } from './config/env.config';
import { prisma } from './config/db.config';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : (env.PORT || 5000);
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`==================================================`);
  console.log(`🚀 TriSetu Backend running on http://${HOST}:${PORT}`);
  console.log(`📑 Swagger Docs: http://${HOST}:${PORT}/api-docs`);
  console.log(`==================================================`);
});

// Asynchronously connect to Neon database
prisma.$connect()
  .then(() => {
    console.log('✅ Connected to Neon PostgreSQL');
  })
  .catch((err) => {
    console.error('⚠️ Database connection error:', err.message);
  });

export default server;
