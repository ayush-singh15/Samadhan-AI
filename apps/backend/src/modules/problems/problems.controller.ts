import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { problemsService } from './problems.service';
import { sendResponse } from '../../utils/response';

export class ProblemsController {
  async getAllProblems(req: Request, res: Response) {
    try {
      const { status, category } = req.query;
      const problems = await problemsService.getAllProblems({
        status:   status   as string | undefined,
        category: category as string | undefined,
      });
      return sendResponse(res, 200, true, 'Problems fetched successfully', problems);
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  }

  async getProblemById(req: Request, res: Response) {
    try {
      const problem = await problemsService.getProblemById(req.params.id);
      return sendResponse(res, 200, true, 'Problem fetched', problem);
    } catch (err: any) {
      return sendResponse(res, 404, false, err.message);
    }
  }

  async createProblem(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendResponse(res, 401, false, 'Unauthorized');

      const mediaUrls = req.files
        ? (req.files as Express.Multer.File[]).map((f) => `/uploads/${f.filename}`)
        : req.body.mediaUrls || [];

      const problem = await problemsService.createProblem(
        { ...req.body, mediaUrls },
        userId
      );
      return sendResponse(res, 201, true, 'Problem submitted successfully', problem);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { status } = req.body;
      if (!status) return sendResponse(res, 400, false, 'status is required');
      const problem = await problemsService.updateStatus(req.params.id, status);
      return sendResponse(res, 200, true, 'Status updated', problem);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }

  async assignUniversity(req: AuthenticatedRequest, res: Response) {
    try {
      const { universityId } = req.body;
      if (!universityId) return sendResponse(res, 400, false, 'universityId is required');
      const problem = await problemsService.assignUniversity(req.params.id, universityId);
      return sendResponse(res, 200, true, 'University assigned', problem);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }

  async getMyProblems(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendResponse(res, 401, false, 'Unauthorized');
      const problems = await problemsService.getMyProblems(userId);
      return sendResponse(res, 200, true, 'My problems fetched', problems);
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  }
}

export const problemsController = new ProblemsController();
