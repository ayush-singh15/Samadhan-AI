export interface AnalyticsSummary {
  totalProblemsReported: number;
  totalProblemsResolved: number;
  totalActiveProjects: number;
  totalCSRFundingAllocated: number;
  categoryBreakdown: Record<string, number>;
  districtBreakdown: Record<string, number>;
}
