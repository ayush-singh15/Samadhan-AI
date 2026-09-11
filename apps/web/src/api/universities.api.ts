/**
 * Universities API — wraps /api/v1/universities
 *
 * Real endpoints:
 *   GET /api/v1/universities              → list all universities
 *   GET /api/v1/universities/:id/problems → get assigned problems for a university
 *
 * Not yet implemented:
 *   POST /api/v1/universities/:id/proposals  (submit proposal)
 */
import { api } from './axiosInstance';
import type { UniversityProfile } from '../types';
import { mock_universities } from '../mocks';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const universitiesApi = {
  async getAll(): Promise<UniversityProfile[]> {
    try {
      const { data } = await api.get<ApiEnvelope<UniversityProfile[]>>('/universities');
      if (data.success) return data.data;
      return mock_universities;
    } catch {
      console.warn('[universitiesApi.getAll] Backend unavailable, using mock data');
      return mock_universities;
    }
  },
};
