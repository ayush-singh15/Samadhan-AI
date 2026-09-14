import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { industryService } from './industry.service';
import { sendResponse } from '../../utils/response';

export class IndustryController {
  async getPartners(req: Request, res: Response) {
    try {
      const list = await industryService.getIndustryPartners();
      return sendResponse(res, 200, true, 'Industry partners retrieved', list);
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  }

  async getPartnerById(req: Request, res: Response) {
    try {
      const partner = await industryService.getPartnerById(req.params.id);
      return sendResponse(res, 200, true, 'Industry partner details retrieved', partner);
    } catch (err: any) {
      return sendResponse(res, 404, false, err.message);
    }
  }

  async submitFundingOffer(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId, amount } = req.body;
      if (!projectId || !amount) {
        return sendResponse(res, 400, false, 'projectId and amount are required');
      }
      const userId = req.user?.id;
      const offer = await industryService.createFundingOffer(projectId, Number(amount), userId);
      return sendResponse(res, 201, true, 'Funding offer submitted successfully', offer);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }

  async createProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendResponse(res, 401, false, 'Unauthorized');
      const profile = await industryService.createProfile(req.body, userId);
      return sendResponse(res, 201, true, 'Industry profile created', profile);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }
}

export const industryController = new IndustryController();
