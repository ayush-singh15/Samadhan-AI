export class IndustryService {
  private partners = [
    {
      id: 'ind-tata',
      companyName: 'Tata Trusts & Sustainability Foundation',
      registrationNumber: 'CSR-IND-9021',
      csrFocusAreas: ['Water Sanitation', 'Clean Energy', 'Rural Livelihood'],
      totalBudgetAllocated: 50000000,
      totalBudgetCommitted: 18500000,
      contactEmail: 'csr@tatatrusts.org',
    },
    {
      id: 'ind-infosys',
      companyName: 'Infosys Foundation',
      registrationNumber: 'CSR-IND-4412',
      csrFocusAreas: ['Digital Education', 'Healthcare Access', 'Skill Development'],
      totalBudgetAllocated: 75000000,
      totalBudgetCommitted: 32000000,
      contactEmail: 'csr-portal@infosys.com',
    },
  ];

  async getIndustryPartners() {
    return this.partners;
  }

  async createFundingOffer(projectId: string, amount: number) {
    return {
      id: 'offer-' + Date.now(),
      projectId,
      amountOffered: amount,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
  }
}

export const industryService = new IndustryService();
