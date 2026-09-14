import { Router } from 'express';
import { problemsController } from './problems.controller';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { uploadMiddleware } from '../../middlewares/upload.middleware';

const router = Router();

// Public / Read
router.get('/',            (req, res) => problemsController.getAllProblems(req, res));
router.get('/mine',        authenticateJWT, (req, res) => problemsController.getMyProblems(req, res));
router.get('/:id',         (req, res) => problemsController.getProblemById(req, res));
router.get('/:id/matches', (req, res) => problemsController.getMatches(req, res));

// Protected / Mutate
router.post(
  '/',
  authenticateJWT,
  uploadMiddleware.array('attachments', 5),
  (req, res) => problemsController.createProblem(req, res)
);
router.patch('/:id/status', authenticateJWT, (req, res) => problemsController.updateStatus(req, res));
router.post('/:id/assign',  authenticateJWT, (req, res) => problemsController.assignUniversity(req, res));

export default router;
