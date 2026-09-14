import { Router } from 'express';
import { notificationsController } from './notifications.controller';
import { authenticateJWT } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateJWT, (req, res) => notificationsController.getNotifications(req, res));
router.patch('/read-all', authenticateJWT, (req, res) => notificationsController.markAllAsRead(req, res));
router.patch('/:id/read', authenticateJWT, (req, res) => notificationsController.markAsRead(req, res));
router.post('/trigger', authenticateJWT, (req, res) => notificationsController.triggerNotification(req, res));

export default router;
