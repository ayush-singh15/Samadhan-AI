import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { industryService } from './industry.service';
import { sendResponse } from '../../utils/response';

export class IndustryController {
  async getPartners(req: AuthenticatedRequest, res: Response) {
    const list = await industryService.getIndustryPartners();
    return sendResponse(res, 200, true, 'Industry partners retrieved', list);
  }

  async submitFundingOffer(req: AuthenticatedRequest, res: Response) {
    const { projectId, amount } = req.body;
    const offer = await industryService.createFundingOffer(projectId, amount);
    return sendResponse(res, 201, true, 'Funding offer submitted', offer);
  }
}

export const industryController = new IndustryController();
