import { Router } from 'express';
import { projectsController } from './projects.controller';
import { authenticateJWT } from '../../middlewares/auth.middleware';

const router = Router();

// Proposals
router.post('/proposals',             authenticateJWT, (req, res) => projectsController.createProposal(req, res));
router.get('/proposals',              (req, res) => projectsController.getAllProposals(req, res));
router.patch('/proposals/:id/status', authenticateJWT, (req, res) => projectsController.updateProposalStatus(req, res));

// Projects
router.get('/',                       (req, res) => projectsController.getProjects(req, res));
router.get('/university/:universityId', (req, res) => projectsController.getUniversityProjects(req, res));
router.get('/:id',                    (req, res) => projectsController.getProjectById(req, res));

// Milestones
router.patch('/:projectId/milestones/:milestoneId', authenticateJWT, (req, res) => projectsController.updateMilestone(req, res));

export default router;
