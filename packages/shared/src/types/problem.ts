export enum ProblemCategory {
  EDUCATION = 'EDUCATION',
  HEALTHCARE = 'HEALTHCARE',
  AGRICULTURE = 'AGRICULTURE',
  WATER_SANITATION = 'WATER_SANITATION',
  ENVIRONMENT = 'ENVIRONMENT',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  ENERGY = 'ENERGY',
  OTHER = 'OTHER'
}

export enum ProblemStatus {
  SUBMITTED = 'SUBMITTED',
  AI_CATEGORIZED = 'AI_CATEGORIZED',
  ASSIGNED_TO_UNIVERSITY = 'ASSIGNED_TO_UNIVERSITY',
  PROPOSAL_SUBMITTED = 'PROPOSAL_SUBMITTED',
  FUNDING_APPROVED = 'FUNDING_APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: ProblemCategory;
  status: ProblemStatus;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    district: string;
    state: string;
  };
  mediaUrls: string[];
  submittedById: string;
  assignedUniversityId?: string;
  assignedProjectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProblemInput {
  title: string;
  description: string;
  category?: ProblemCategory;
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  state: string;
  mediaUrls?: string[];
}
