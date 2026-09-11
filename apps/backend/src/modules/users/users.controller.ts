import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { usersService } from './users.service';
import { sendResponse } from '../../utils/response';

export class UsersController {
  async getProfile(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id || 'demo_user';
    const profile = await usersService.getProfile(userId);
    return sendResponse(res, 200, true, 'User profile retrieved', profile);
  }
}

export const usersController = new UsersController();
