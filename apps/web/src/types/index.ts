// ============================================================
// TriSetu — Shared Frontend Types
// Aligned with Prisma schema in apps/backend/prisma/schema.prisma
// ============================================================

// ---- Users & Auth ------------------------------------------

/** Matches Prisma enum Role */
export type UserRole = 'CITIZEN' | 'UNIVERSITY' | 'INDUSTRY' | 'GOVERNMENT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ---- Problems ----------------------------------------------

/** Matches Prisma enum ProblemStatus */
export type ProblemStatus =
  | 'SUBMITTED'
  | 'AI_CATEGORIZED'
  | 'ASSIGNED_TO_UNIVERSITY'
  | 'PROPOSAL_SUBMITTED'
  | 'FUNDING_APPROVED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED';

/** Matches Prisma enum ProblemCategory */
export type ProblemCategory =
  | 'EDUCATION'
  | 'HEALTHCARE'
  | 'AGRICULTURE'
  | 'WATER_SANITATION'
  | 'ENVIRONMENT'
  | 'INFRASTRUCTURE'
  | 'ENERGY'
  | 'OTHER';

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: ProblemCategory;
  status: ProblemStatus;
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  state: string;
  mediaUrls?: string[];
  submittedById: string;
  assignedUniversityId?: string;
  createdAt: string;
  updatedAt: string;
  // AI-added fields (from AI service, not in Prisma yet)
  aiCategory?: string;
  aiConfidence?: number;
  similarProblems?: SimilarProblem[];
}

export interface SimilarProblem {
  problemId: string;
  title: string;
  similarity: number;
}

// ---- University Profile ------------------------------------

export interface UniversityProfile {
  id: string;
  userId: string;
  name: string;
  code: string;
  expertiseTags: string[];
  department: string;
  state: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Industry Profile --------------------------------------

export interface IndustryProfile {
  id: string;
  userId: string;
  companyName: string;
  registrationNumber: string;
  csrFocusAreas: string[];
  totalBudgetAllocated: number;
  totalBudgetCommitted: number;
  contactEmail: string;
}

// ---- Proposals ---------------------------------------------

export interface Proposal {
  id: string;
  problemId: string;
  universityId: string;
  title: string;
  abstract: string;
  budgetRequired: number;
  timelineMonths: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  // Joined fields (populated by API)
  universityName?: string;
  problemTitle?: string;
}

// ---- Projects & Milestones ---------------------------------

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  fundingPercentage: number;
  createdAt: string;
}

export interface Project {
  id: string;
  proposalId: string;
  industryId?: string;
  title: string;
  status: string;
  fundedAmount: number;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
  // Joined fields
  problemTitle?: string;
  universityName?: string;
}

// ---- Funding -----------------------------------------------

export interface FundingOffer {
  id: string;
  industryProfileId: string;
  projectId: string;
  amountOffered: number;
  status: string;
  createdAt: string;
}

// ---- Matching (AI service) ----------------------------------

export interface UniversityMatch {
  universityId: string;
  universityName: string;
  department: string;
  matchReason: string;
  matchScore: number;
}

// ---- Analytics / Dashboard ---------------------------------

export interface DashboardStats {
  totalProblems: number;
  problemsByStatus: Record<ProblemStatus, number>;
  totalProposals: number;
  activeProjects: number;
  resolvedProblems: number;
}

// ---- API Response wrappers (matches backend sendResponse) ---

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ---- UI helpers --------------------------------------------

export type LoadState = 'idle' | 'loading' | 'success' | 'error';
