import app from './app';
import { env } from './config/env.config';
import { connectDB } from './config/db.config';

const PORT = env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 TriSetu Backend Server running on port ${PORT}`);
    console.log(`📑 OpenAPI Swagger Docs: http://localhost:${PORT}/api-docs`);
    console.log(`==================================================`);
  });
};

startServer();
