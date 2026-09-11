import jwt from 'jsonwebtoken';
import { env } from '../../config/env.config';

export class AuthService {
  async register(data: { email: string; name: string; role: string; password?: string }) {
    const user = {
      id: 'usr_' + Date.now(),
      email: data.email,
      name: data.name,
      role: data.role || 'CITIZEN',
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return { user, token };
  }

  async login(email: string) {
    const user = {
      id: 'usr_demo_123',
      email,
      name: 'Demo TriSetu User',
      role: 'CITIZEN',
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return { user, token };
  }
}

export const authService = new AuthService();
