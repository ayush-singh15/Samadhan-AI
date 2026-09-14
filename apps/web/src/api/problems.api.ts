import { api } from './axiosInstance';
import type { Problem, ProblemCategory } from '../types';
import { mock_problems, mock_matches } from '../mocks';

export interface UniversityMatch {
  universityId: string;
  name: string;
  code: string;
  department: string;
  state: string;
  matchScore: number;
  matchingTags: string[];
  rationale: string;
  leadContact: string;
  activeLoad: number;
}

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
  /** GET /api/v1/problems — returns all problems */
  async getAll(params?: { status?: string; category?: string }): Promise<Problem[]> {
    try {
      const { data } = await api.get<ApiEnvelope<Problem[]>>('/problems', { params });
      if (data.success) return data.data;
      return mock_problems;
    } catch {
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

  /** GET /api/v1/problems/:id/matches — AI ranking for university assignment */
  async getMatches(id: string): Promise<UniversityMatch[]> {
    try {
      const { data } = await api.get<ApiEnvelope<UniversityMatch[]>>(`/problems/${id}/matches`);
      if (data.success && data.data?.length > 0) return data.data;
      return mock_matches as any;
    } catch {
      console.warn('[problemsApi.getMatches] Falling back to mock matches');
      return mock_matches as any;
    }
  },

  /** POST /api/v1/problems/:id/assign — Assign problem mandate to university */
  async assignUniversity(problemId: string, universityId: string): Promise<Problem> {
    const { data } = await api.post<ApiEnvelope<Problem>>(`/problems/${problemId}/assign`, { universityId });
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  /** PATCH /api/v1/problems/:id/status — Admin review approval/rejection */
  async updateStatus(problemId: string, status: string): Promise<Problem> {
    const { data } = await api.patch<ApiEnvelope<Problem>>(`/problems/${problemId}/status`, { status });
    if (!data.success) throw new Error(data.message);
    return data.data;
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
