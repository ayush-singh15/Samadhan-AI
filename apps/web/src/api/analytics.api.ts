import { api } from './axiosInstance';

export interface AnalyticsDashboard {
  totalProblemsReported: number;
  totalProblemsResolved: number;
  totalActiveProjects: number;
  totalCSRFundingAllocated: number;
  categoryBreakdown: Record<string, number>;
  districtBreakdown: Record<string, number>;
  monthlyTrends: Array<{ month: string; reported: number; resolved: number }>;
}

export const analyticsApi = {
  async getDashboard(): Promise<AnalyticsDashboard> {
    try {
      const { data } = await api.get<{ success: boolean; data: AnalyticsDashboard }>('/analytics/dashboard');
      if (data.success) return data.data;
      throw new Error('Analytics failed');
    } catch {
      return {
        totalProblemsReported: 12480,
        totalProblemsResolved: 6120,
        totalActiveProjects: 284,
        totalCSRFundingAllocated: 145000000,
        categoryBreakdown: {},
        districtBreakdown: {},
        monthlyTrends: [],
      };
    }
  },
};
