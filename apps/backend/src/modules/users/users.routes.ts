import { Router } from 'express';
import { usersController } from './users.controller';
import { authenticateJWT } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/profile', authenticateJWT, (req, res) => usersController.getProfile(req, res));
router.patch('/profile', authenticateJWT, (req, res) => usersController.updateProfile(req, res));

export default router;
