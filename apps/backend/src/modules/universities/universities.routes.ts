import { Router } from 'express';
import { universitiesController } from './universities.controller';

const router = Router();

router.get('/', (req, res) => universitiesController.getUniversities(req, res));
router.get('/:id/problems', (req, res) => universitiesController.getAssignedProblems(req, res));

export default router;
