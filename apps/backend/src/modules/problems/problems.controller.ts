import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { problemsService } from './problems.service';
import { sendResponse } from '../../utils/response';

export class ProblemsController {
  async getAllProblems(req: Request, res: Response) {
    try {
      const { status, category, district, search, minSeverity } = req.query;
      const problems = await problemsService.getAllProblems({
        status:      status      as string | undefined,
        category:    category    as string | undefined,
        district:    district    as string | undefined,
        search:      search      as string | undefined,
        minSeverity: minSeverity ? parseInt(minSeverity as string, 10) : undefined,
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

  async getMatches(req: Request, res: Response) {
    try {
      const matches = await problemsService.getMatches(req.params.id);
      return sendResponse(res, 200, true, 'University matches computed', matches);
    } catch (err: any) {
      return sendResponse(res, 404, false, err.message);
    }
  }

  async createProblem(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendResponse(res, 401, false, 'Unauthorized');

      const uploadedFiles = req.files ? (req.files as Express.Multer.File[]) : [];
      const fileUrls = uploadedFiles.map((f) => `/uploads/${f.filename}`);

      let existingMedia: string[] = [];
      if (req.body.mediaUrls) {
        existingMedia = Array.isArray(req.body.mediaUrls)
          ? req.body.mediaUrls
          : [req.body.mediaUrls];
      }
      const combinedMedia = [...fileUrls, ...existingMedia];

      const problem = await problemsService.createProblem(
        {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          address: req.body.address,
          district: req.body.district,
          state: req.body.state,
          latitude: parseFloat(req.body.latitude) || 0,
          longitude: parseFloat(req.body.longitude) || 0,
          mediaUrls: combinedMedia,
        },
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

  async submitFeedback(req: AuthenticatedRequest, res: Response) {
    try {
      const { rating, helped, comment } = req.body;
      if (rating === undefined || helped === undefined) {
        return sendResponse(res, 400, false, 'rating and helped are required');
      }
      const userId = req.user?.id;
      const feedback = await problemsService.submitFeedback(
        req.params.id,
        { rating: Number(rating), helped: Boolean(helped), comment },
        userId
      );
      return sendResponse(res, 201, true, 'Social audit feedback recorded successfully', feedback);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }

  async getFeedback(req: Request, res: Response) {
    try {
      const list = await problemsService.getFeedback(req.params.id);
      return sendResponse(res, 200, true, 'Feedback records retrieved', list);
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  }
}

export const problemsController = new ProblemsController();
