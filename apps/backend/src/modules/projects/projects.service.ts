export class ProjectsService {
  private projects = [
    {
      id: 'proj-001',
      proposalId: 'prop-501',
      problemId: 'prob-101',
      universityId: 'univ-iitk',
      industryId: 'ind-tata',
      title: 'Low-Cost Bio-Sand Water Filtration System for Rural Communities',
      status: 'IN_DEVELOPMENT',
      fundedAmount: 1200000,
      milestones: [
        { id: 'm-1', title: 'Prototype Design & Testing', isCompleted: true, fundingPercentage: 30 },
        { id: 'm-2', title: 'Pilot Installation in Rampur', isCompleted: false, fundingPercentage: 40 },
        { id: 'm-3', title: 'Community Training & Handover', isCompleted: false, fundingPercentage: 30 },
      ],
      ipRightsNotes: 'Joint IP ownership between IIT Kanpur and Tata Trusts with open royalty-free license for public health deployment.',
      createdAt: new Date().toISOString(),
    },
  ];

  async getProjects() {
    return this.projects;
  }

  async getProjectById(id: string) {
    return this.projects.find((p) => p.id === id) || this.projects[0];
  }
}

export const projectsService = new ProjectsService();
