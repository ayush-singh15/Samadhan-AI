import { api } from './axiosInstance';
import type { Project, Proposal } from '../types';
import { mock_projects, mock_proposals } from '../mocks';

interface CreateProposalPayload {
  problemId: string;
  universityId?: string;
  title: string;
  abstract: string;
  budgetRequired: number;
  timelineMonths: number;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const projectsApi = {
  /** GET /api/v1/projects — returns all projects with milestones & funding */
  async getAll(): Promise<Project[]> {
    try {
      const { data } = await api.get<ApiEnvelope<Project[]>>('/projects');
      if (data.success) return data.data;
      return mock_projects;
    } catch {
      console.warn('[projectsApi.getAll] Backend unavailable, using mock data');
      return mock_projects;
    }
  },

  /** GET /api/v1/projects/:id */
  async getById(id: string): Promise<Project | null> {
    try {
      const { data } = await api.get<ApiEnvelope<Project>>(`/projects/${id}`);
      if (data.success) return data.data;
      return null;
    } catch {
      console.warn('[projectsApi.getById] Backend unavailable, using mock data');
      return mock_projects.find((p) => p.id === id) ?? null;
    }
  },

  /** POST /api/v1/projects/proposals — submit engineering feasibility proposal */
  async createProposal(payload: CreateProposalPayload): Promise<Proposal> {
    const { data } = await api.post<ApiEnvelope<Proposal>>('/projects/proposals', payload);
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  /** GET /api/v1/projects/proposals — get list of proposals */
  async getAllProposals(filters?: { status?: string; universityId?: string }): Promise<Proposal[]> {
    try {
      const { data } = await api.get<ApiEnvelope<Proposal[]>>('/projects/proposals', { params: filters });
      if (data.success) return data.data;
      return mock_proposals;
    } catch {
      console.warn('[projectsApi.getAllProposals] Backend unavailable, using mock data');
      return mock_proposals;
    }
  },

  /** PATCH /api/v1/projects/proposals/:id/status — approve or reject proposal */
  async updateProposalStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<Proposal> {
    const { data } = await api.patch<ApiEnvelope<Proposal>>(`/projects/proposals/${id}/status`, { status });
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  /** PATCH /api/v1/projects/:projectId/milestones/:milestoneId — verify milestone completion */
  async updateMilestone(projectId: string, milestoneId: string, isCompleted: boolean): Promise<any> {
    const { data } = await api.patch<ApiEnvelope<any>>(`/projects/${projectId}/milestones/${milestoneId}`, { isCompleted });
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  /** GET /api/v1/projects/university/:universityId */
  async getUniversityProjects(universityId: string): Promise<Project[]> {
    try {
      const { data } = await api.get<ApiEnvelope<Project[]>>(`/projects/university/${universityId}`);
      if (data.success) return data.data;
      return mock_projects;
    } catch {
      return mock_projects;
    }
  },
};
