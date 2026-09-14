import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { usersService } from './users.service';
import { sendResponse } from '../../utils/response';

export class UsersController {
  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return sendResponse(res, 401, false, 'Unauthorized');
      }
      const profile = await usersService.getProfile(userId);
      return sendResponse(res, 200, true, 'User profile retrieved', profile);
    } catch (err: any) {
      return sendResponse(res, 404, false, err.message);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return sendResponse(res, 401, false, 'Unauthorized');
      }
      const updated = await usersService.updateProfile(userId, req.body);
      return sendResponse(res, 200, true, 'User profile updated', updated);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }
}

export const usersController = new UsersController();
