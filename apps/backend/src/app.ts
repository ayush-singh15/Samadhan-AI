import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';
import { errorHandler } from './middlewares/error.middleware';

// Routes imports
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import problemsRoutes from './modules/problems/problems.routes';
import universitiesRoutes from './modules/universities/universities.routes';
import industryRoutes from './modules/industry/industry.routes';
import projectsRoutes from './modules/projects/projects.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import eventsRoutes from './modules/events/events.routes';

const app: Application = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows uploaded images/videos to be viewed from web frontend
}));

app.use(cors({
  origin: [
    'https://trisetu.vercel.app',
    'https://samadhan-ai.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || '',
  ].filter(Boolean),
  credentials: true,
}));

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP. Please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 requests per 15 min for auth/OTP endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Please try again after 15 minutes.' },
});

app.use(generalLimiter);
app.use('/api/v1/auth', authLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads static directory
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Swagger Documentation UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Samadhan AI Backend Microservice is Healthy' });
});

// API Routes (v1)
const API_PREFIX = '/api/v1';
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, usersRoutes);
app.use(`${API_PREFIX}/problems`, problemsRoutes);
app.use(`${API_PREFIX}/universities`, universitiesRoutes);
app.use(`${API_PREFIX}/industry`, industryRoutes);
app.use(`${API_PREFIX}/projects`, projectsRoutes);
app.use(`${API_PREFIX}/notifications`, notificationsRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);
app.use(`${API_PREFIX}/events`, eventsRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
