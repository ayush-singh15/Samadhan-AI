export class AnalyticsService {
  async getDashboardAnalytics() {
    return {
      totalProblemsReported: 1248,
      totalProblemsResolved: 612,
      totalActiveProjects: 284,
      totalCSRFundingAllocated: 145000000,
      categoryBreakdown: {
        WATER_SANITATION: 412,
        AGRICULTURE: 310,
        EDUCATION: 245,
        HEALTHCARE: 180,
        ENVIRONMENT: 101,
      },
      districtBreakdown: {
        Lucknow: 320,
        Varanasi: 240,
        Kanpur: 195,
        Gorakhpur: 150,
        Prayagraj: 110,
      },
      monthlyTrends: [
        { month: 'Jan', reported: 120, resolved: 80 },
        { month: 'Feb', reported: 150, resolved: 95 },
        { month: 'Mar', reported: 180, resolved: 110 },
        { month: 'Apr', reported: 210, resolved: 140 },
        { month: 'May', reported: 260, resolved: 187 },
      ],
    };
  }
}

export const analyticsService = new AnalyticsService();
