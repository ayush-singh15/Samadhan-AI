import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register',   (req, res) => authController.register(req, res));
router.post('/login',      (req, res) => authController.login(req, res));
router.post('/send-otp',   (req, res) => authController.sendOtp(req, res));
router.post('/verify-otp', (req, res) => authController.verifyOtp(req, res));
router.get('/me',          authenticate, (req, res) => authController.me(req, res));

export default router;
