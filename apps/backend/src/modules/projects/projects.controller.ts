import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { projectsService } from './projects.service';
import { sendResponse } from '../../utils/response';

export class ProjectsController {
  async getProjects(req: Request, res: Response) {
    try {
      const list = await projectsService.getAll();
      return sendResponse(res, 200, true, 'Projects retrieved successfully', list);
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  }

  async getProjectById(req: Request, res: Response) {
    try {
      const project = await projectsService.getById(req.params.id);
      return sendResponse(res, 200, true, 'Project details retrieved', project);
    } catch (err: any) {
      return sendResponse(res, 404, false, err.message);
    }
  }

  async createProposal(req: AuthenticatedRequest, res: Response) {
    try {
      const proposal = await projectsService.createProposal(req.body);
      return sendResponse(res, 201, true, 'Proposal submitted', proposal);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }

  async getAllProposals(req: Request, res: Response) {
    try {
      const { status, universityId } = req.query;
      const proposals = await projectsService.getAllProposals({
        status: status as string | undefined,
        universityId: universityId as string | undefined,
      });
      return sendResponse(res, 200, true, 'Proposals fetched', proposals);
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  }

  async updateProposalStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { status } = req.body;
      const proposal = await projectsService.updateProposalStatus(req.params.id, status);
      return sendResponse(res, 200, true, 'Proposal status updated', proposal);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }

  async updateMilestone(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId, milestoneId } = req.params;
      const { isCompleted } = req.body;
      const ms = await projectsService.updateMilestone(projectId, milestoneId, isCompleted);
      return sendResponse(res, 200, true, 'Milestone updated', ms);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }

  async getUniversityProjects(req: AuthenticatedRequest, res: Response) {
    try {
      const { universityId } = req.params;
      const projects = await projectsService.getUniversityProjects(universityId);
      return sendResponse(res, 200, true, 'University projects fetched', projects);
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  }
}

export const projectsController = new ProjectsController();
