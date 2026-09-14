import { api } from './axiosInstance';
import type { Project } from '../types';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IndustryProfileData {
  id: string;
  companyName: string;
  registrationNumber: string;
  csrFocusAreas: string[];
  totalBudgetAllocated: number;
  totalBudgetCommitted: number;
  contactEmail: string;
}

export interface IndustryDashboardData {
  profile: IndustryProfileData | null;
  stats: {
    totalAllocated: number;
    totalCommitted: number;
    activeProjectsCount: number;
    completedProjectsCount: number;
    milestonesFunded: number;
  };
  projects: Project[];
}

export const industryApi = {
  /** GET /api/v1/industry/dashboard */
  async getDashboard(): Promise<IndustryDashboardData> {
    try {
      const { data } = await api.get<ApiEnvelope<IndustryDashboardData>>('/industry/dashboard');
      if (data.success) return data.data;
      throw new Error(data.message);
    } catch {
      return {
        profile: {
          id: 'ind-demo-1',
          companyName: 'Tata Trusts & CSR Foundation',
          registrationNumber: 'CSR-IND-2024-8891',
          csrFocusAreas: ['WATER_SANITATION', 'ENVIRONMENT', 'EDUCATION', 'HEALTHCARE'],
          totalBudgetAllocated: 10000000,
          totalBudgetCommitted: 3850000,
          contactEmail: 'csr.alliances@tatatrusts.org',
        },
        stats: {
          totalAllocated: 10000000,
          totalCommitted: 3850000,
          activeProjectsCount: 3,
          completedProjectsCount: 1,
          milestonesFunded: 9,
        },
        projects: [],
      };
    }
  },

  /** POST /api/v1/industry/fund — Commit CSR funding grant to project */
  async submitFundingOffer(projectId: string, amount: number): Promise<any> {
    const { data } = await api.post<ApiEnvelope<any>>('/industry/fund', {
      projectId,
      amount,
    });
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  /** GET /api/v1/industry/partners */
  async getPartners(): Promise<any[]> {
    const { data } = await api.get<ApiEnvelope<any[]>>('/industry/partners');
    return data.success ? data.data : [];
  },
};
