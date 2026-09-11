export class UniversitiesService {
  private universities = [
    {
      id: 'univ-iitk',
      name: 'Indian Institute of Technology Kanpur',
      code: 'IITK',
      expertiseTags: ['Water Filtration', 'Environmental Engineering', 'IoT Sensors'],
      department: 'Civil & Environmental Engineering',
      state: 'Uttar Pradesh',
      contactEmail: 'innovations@iitk.ac.in',
      assignedProblemsCount: 4,
    },
    {
      id: 'univ-bhu',
      name: 'Banaras Hindu University',
      code: 'BHU',
      expertiseTags: ['Agronomy', 'Solar Energy', 'Rural Technology'],
      department: 'Institute of Agricultural Sciences',
      state: 'Uttar Pradesh',
      contactEmail: 'csr-cell@bhu.ac.in',
      assignedProblemsCount: 2,
    },
  ];

  async getUniversities() {
    return this.universities;
  }

  async getAssignedProblems(universityId: string) {
    return [
      {
        id: 'prob-101',
        title: 'Contaminated Drinking Water Tank in Rampur Village',
        category: 'WATER_SANITATION',
        status: 'ASSIGNED_TO_UNIVERSITY',
        district: 'Lucknow',
      },
    ];
  }
}

export const universitiesService = new UniversitiesService();
