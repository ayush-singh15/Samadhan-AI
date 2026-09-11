export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  fundingPercentage: number;
}

export interface Proposal {
  id: string;
  problemId: string;
  universityId: string;
  title: string;
  abstract: string;
  budgetRequired: number;
  timelineMonths: number;
  status: 'DRAFT' | 'SUBMITTED' | 'FUNDED' | 'REJECTED';
}

export interface Project {
  id: string;
  proposalId: string;
  problemId: string;
  universityId: string;
  industryId?: string;
  title: string;
  status: 'IN_DEVELOPMENT' | 'TESTING' | 'DEPLOYED' | 'CLOSED';
  fundedAmount: number;
  milestones: Milestone[];
  ipRightsNotes?: string;
  createdAt: string;
}
