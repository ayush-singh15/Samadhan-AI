import app from './app';
import { env } from './config/env.config';
import { prisma } from './config/db.config';

const PORT = env.PORT || 5000;

const startServer = async () => {
  // Verify DB connection
  await prisma.$connect();
  console.log('✅ Connected to Neon PostgreSQL');

  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 TriSetu Backend running on port ${PORT}`);
    console.log(`📑 Swagger Docs: http://localhost:${PORT}/api-docs`);
    console.log(`==================================================`);
  });
};

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
