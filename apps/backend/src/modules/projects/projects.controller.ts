import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { projectsService } from './projects.service';
import { sendResponse } from '../../utils/response';

export class ProjectsController {
  async getProjects(req: AuthenticatedRequest, res: Response) {
    const list = await projectsService.getProjects();
    return sendResponse(res, 200, true, 'Projects retrieved successfully', list);
  }

  async getProjectById(req: AuthenticatedRequest, res: Response) {
    const project = await projectsService.getProjectById(req.params.id);
    return sendResponse(res, 200, true, 'Project details retrieved', project);
  }
}

export const projectsController = new ProjectsController();
