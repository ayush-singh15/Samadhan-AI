import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { universitiesService } from './universities.service';
import { sendResponse } from '../../utils/response';

export class UniversitiesController {
  async getUniversities(req: AuthenticatedRequest, res: Response) {
    const list = await universitiesService.getUniversities();
    return sendResponse(res, 200, true, 'Universities retrieved', list);
  }

  async getAssignedProblems(req: AuthenticatedRequest, res: Response) {
    const univId = req.params.id || 'univ-iitk';
    const problems = await universitiesService.getAssignedProblems(univId);
    return sendResponse(res, 200, true, 'Assigned problems fetched', problems);
  }
}

export const universitiesController = new UniversitiesController();
