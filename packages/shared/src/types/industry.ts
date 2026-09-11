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

export interface FundingOffer {
  id: string;
  industryProfileId: string;
  projectId: string;
  amountOffered: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  terms?: string;
  createdAt: string;
}
