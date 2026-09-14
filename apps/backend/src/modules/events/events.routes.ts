import { Router } from 'express';
import { eventsController } from './events.controller';

const router = Router();

router.get('/stream', (req, res) => eventsController.stream(req, res));
router.get('/recent', (req, res) => eventsController.getRecent(req, res));

export default router;
