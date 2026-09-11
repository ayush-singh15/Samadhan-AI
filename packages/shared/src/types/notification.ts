export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'PROBLEM_UPDATE' | 'PROPOSAL_SUBMITTED' | 'FUNDING_RECEIVED' | 'MILESTONE_COMPLETED';
  isRead: boolean;
  createdAt: string;
}
