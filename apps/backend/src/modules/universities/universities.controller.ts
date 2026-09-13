import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { universitiesService } from './universities.service';
import { sendResponse } from '../../utils/response';

export class UniversitiesController {
  async getUniversities(req: Request, res: Response) {
    try {
      const list = await universitiesService.getAll();
      return sendResponse(res, 200, true, 'Universities retrieved', list);
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  }

  async getUniversityById(req: Request, res: Response) {
    try {
      const uni = await universitiesService.getById(req.params.id);
      return sendResponse(res, 200, true, 'University fetched', uni);
    } catch (err: any) {
      return sendResponse(res, 404, false, err.message);
    }
  }

  async getAssignedProblems(req: AuthenticatedRequest, res: Response) {
    try {
      const univId = req.params.id;
      const uni = await universitiesService.getById(univId);
      return sendResponse(res, 200, true, 'Assigned problems fetched', uni.assignedProblems);
    } catch (err: any) {
      return sendResponse(res, 404, false, err.message);
    }
  }

  async createProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendResponse(res, 401, false, 'Unauthorized');
      const profile = await universitiesService.createProfile(req.body, userId);
      return sendResponse(res, 201, true, 'University profile created', profile);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }
}

export const universitiesController = new UniversitiesController();
