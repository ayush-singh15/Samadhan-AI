import { Router } from 'express';
import { problemsController } from './problems.controller';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { uploadMiddleware } from '../../middlewares/upload.middleware';

const router = Router();

router.get('/', (req, res) => problemsController.getAllProblems(req, res));
router.get('/:id', (req, res) => problemsController.getProblemById(req, res));
router.post(
  '/',
  authenticateJWT,
  uploadMiddleware.array('attachments', 5),
  (req, res) => problemsController.createProblem(req, res)
);

export default router;
