import { Router } from 'express';
import { industryController } from './industry.controller';
import { authenticateJWT } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/partners', (req, res) => industryController.getPartners(req, res));
router.get('/partners/:id', (req, res) => industryController.getPartnerById(req, res));
router.post('/fund', authenticateJWT, (req, res) => industryController.submitFundingOffer(req, res));
router.post('/profile', authenticateJWT, (req, res) => industryController.createProfile(req, res));

export default router;
