/**
 * Problems API — wraps GET/POST /api/v1/problems
 *
 * Real endpoints available:
 *   GET  /api/v1/problems          → getAllProblems (no auth required)
 *   GET  /api/v1/problems/:id      → getProblemById (no auth required)
 *   POST /api/v1/problems          → createProblem (JWT required, multipart/form-data)
 *
 * Not yet implemented in backend:
 *   PATCH /api/v1/problems/:id/status    (needed for admin approve/reject)
 *   PATCH /api/v1/problems/:id/assign    (needed for university matching)
 *   GET   /api/v1/problems?submittedById (needed for citizen "my problems")
 */
import { api } from './axiosInstance';
import type { Problem, ProblemCategory } from '../types';
import { mock_problems } from '../mocks';

interface CreateProblemPayload {
  title: string;
  description: string;
  category: ProblemCategory;
  address: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  attachments?: File[];
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const problemsApi = {
  /** GET /api/v1/problems — returns all problems (uses real API) */
  async getAll(): Promise<Problem[]> {
    try {
      const { data } = await api.get<ApiEnvelope<Problem[]>>('/problems');
      if (data.success) return data.data;
      return mock_problems;
    } catch {
      // Backend not running — fall back to mocks silently in dev
      console.warn('[problemsApi.getAll] Backend unavailable, using mock data');
      return mock_problems;
    }
  },

  /** GET /api/v1/problems/:id */
  async getById(id: string): Promise<Problem | null> {
    try {
      const { data } = await api.get<ApiEnvelope<Problem>>(`/problems/${id}`);
      if (data.success) return data.data;
      return null;
    } catch {
      console.warn('[problemsApi.getById] Backend unavailable, using mock data');
      return mock_problems.find((p) => p.id === id) ?? null;
    }
  },

  /** POST /api/v1/problems — creates a problem (JWT required) */
  async create(payload: CreateProblemPayload): Promise<Problem> {
    const form = new FormData();
    form.append('title', payload.title);
    form.append('description', payload.description);
    form.append('category', payload.category);
    form.append('address', payload.address);
    form.append('district', payload.district);
    form.append('state', payload.state);
    form.append('latitude', String(payload.latitude));
    form.append('longitude', String(payload.longitude));
    if (payload.attachments) {
      payload.attachments.forEach((f) => form.append('attachments', f));
    }

    const { data } = await api.post<ApiEnvelope<Problem>>('/problems', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
};
