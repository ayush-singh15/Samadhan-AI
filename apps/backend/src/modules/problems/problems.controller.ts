import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { problemsService } from './problems.service';
import { sendResponse } from '../../utils/response';

export class ProblemsController {
  async getAllProblems(req: AuthenticatedRequest, res: Response) {
    const problems = await problemsService.getAllProblems();
    return sendResponse(res, 200, true, 'Problems fetched successfully', problems);
  }

  async getProblemById(req: AuthenticatedRequest, res: Response) {
    const problem = await problemsService.getProblemById(req.params.id);
    return sendResponse(res, 200, true, 'Problem details retrieved', problem);
  }

  async createProblem(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id || 'usr-citizen-01';
    const mediaUrls = req.files
      ? (req.files as Express.Multer.File[]).map((f) => `/uploads/${f.filename}`)
      : [];

    const problemData = {
      ...req.body,
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : req.body.mediaUrls || [],
    };

    const newProblem = await problemsService.createProblem(problemData, userId);
    return sendResponse(res, 201, true, 'Problem submitted successfully', newProblem);
  }
}

export const problemsController = new ProblemsController();
