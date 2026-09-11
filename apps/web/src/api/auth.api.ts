/**
 * Auth API — wraps POST /api/v1/auth/register and /auth/login
 *
 * Backend (auth.service.ts) is currently a demo stub:
 *   - register: accepts { email, name, role } — no password validation yet
 *   - login: accepts { email } — always returns a CITIZEN demo user
 *
 * The frontend sends the expected fields; the backend stub ignores extras gracefully.
 */
import { api } from './axiosInstance';
import type { User } from '../types';

interface RegisterPayload {
  email: string;
  name: string;
  role: string;
  password?: string;
}

interface LoginPayload {
  email: string;
  password?: string;
}

interface AuthResult {
  user: User;
  token: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authApi = {
  /** POST /api/v1/auth/register */
  async register(payload: RegisterPayload): Promise<AuthResult> {
    const { data } = await api.post<ApiEnvelope<AuthResult>>('/auth/register', payload);
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  /** POST /api/v1/auth/login */
  async login(payload: LoginPayload): Promise<AuthResult> {
    const { data } = await api.post<ApiEnvelope<AuthResult>>('/auth/login', payload);
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
};
