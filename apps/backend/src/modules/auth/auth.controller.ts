import { Request, Response } from 'express';
import { authService } from './auth.service';
import { sendResponse } from '../../utils/response';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, name, role } = req.body;
      const result = await authService.register({ email, name, role });
      return sendResponse(res, 201, true, 'User registered successfully', result);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await authService.login(email);
      return sendResponse(res, 200, true, 'Login successful', result);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  }
}

export const authController = new AuthController();
