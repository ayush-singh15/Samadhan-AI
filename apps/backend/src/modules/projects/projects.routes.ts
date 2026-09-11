import { Router } from 'express';
import { projectsController } from './projects.controller';

const router = Router();

router.get('/', (req, res) => projectsController.getProjects(req, res));
router.get('/:id', (req, res) => projectsController.getProjectById(req, res));

export default router;
