import { problemQueue } from '../../queues/problemQueue';

export class ProblemsService {
  private sampleProblems = [
    {
      id: 'prob-101',
      title: 'Contaminated Drinking Water Tank in Rampur Village',
      description: 'The overhead public water tank in Ward 4 has high sediment and algae build-up, causing waterborne illnesses.',
      category: 'WATER_SANITATION',
      status: 'ASSIGNED_TO_UNIVERSITY',
      latitude: 26.8467,
      longitude: 80.9462,
      address: 'Ward 4, Rampur Village',
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      mediaUrls: ['https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3'],
      submittedById: 'usr-citizen-01',
      assignedUniversityId: 'univ-iitk',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prob-102',
      title: 'Lack of Solar Cold Storage for Perishable Produce',
      description: 'Farmers lose 40% of tomato harvest due to lack of local grid-independent cold storage.',
      category: 'AGRICULTURE',
      status: 'SUBMITTED',
      latitude: 25.3176,
      longitude: 82.9739,
      address: 'Kisan Mandi, Block B',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      mediaUrls: ['https://images.unsplash.com/photo-1500937386664-56d1dfef3854'],
      submittedById: 'usr-citizen-02',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  async getAllProblems() {
    return this.sampleProblems;
  }

  async getProblemById(id: string) {
    return this.sampleProblems.find((p) => p.id === id) || this.sampleProblems[0];
  }

  async createProblem(data: any, userId: string) {
    const newProblem = {
      id: 'prob-' + Date.now(),
      ...data,
      status: 'SUBMITTED',
      submittedById: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Dispatch background job for AI categorization
    try {
      await problemQueue.add('categorize', { problemId: newProblem.id, title: data.title });
    } catch (e) {
      console.warn('Queue dispatch fallback');
    }

    this.sampleProblems.unshift(newProblem);
    return newProblem;
  }
}

export const problemsService = new ProblemsService();
