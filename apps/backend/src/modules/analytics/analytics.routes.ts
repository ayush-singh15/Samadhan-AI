import { Router } from 'express';
import { analyticsController } from './analytics.controller';

const router = Router();

router.get('/dashboard', (req, res) => analyticsController.getDashboard(req, res));

export default router;
