import { Request, Response } from 'express';
import { authService } from './auth.service';
import { sendResponse } from '../../utils/response';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, name, role, password } = req.body;
      if (!email || !name || !password) {
        return sendResponse(res, 400, false, 'email, name and password are required');
      }
      const result = await authService.register({ email, name, role: role || 'CITIZEN', password });
      return sendResponse(res, 201, true, 'User registered successfully', result);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return sendResponse(res, 400, false, 'email and password are required');
      }
      const result = await authService.login({ email, password });
      return sendResponse(res, 200, true, 'Login successful', result);
    } catch (err: any) {
      return sendResponse(res, 401, false, err.message);
    }
  }

  async me(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return sendResponse(res, 401, false, 'Unauthorized');
      const user = await authService.getMe(userId);
      return sendResponse(res, 200, true, 'User fetched', user);
    } catch (err: any) {
      return sendResponse(res, 404, false, err.message);
    }
  }
}

export const authController = new AuthController();
