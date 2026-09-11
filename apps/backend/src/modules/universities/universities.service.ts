import { prisma } from '../../config/db.config';

export class UniversitiesService {
  async getAll() {
    return prisma.universityProfile.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async getById(id: string) {
    const uni = await prisma.universityProfile.findUnique({
      where: { id },
      include: {
        user:            { select: { id: true, name: true, email: true } },
        assignedProblems: true,
        proposals:       true,
      },
    });
    if (!uni) throw new Error('University not found');
    return uni;
  }

  async createProfile(data: {
    name: string; code: string; department: string;
    state: string; contactEmail: string; expertiseTags?: string[];
  }, userId: string) {
    return prisma.universityProfile.create({
      data: { ...data, userId, expertiseTags: data.expertiseTags || [] },
    });
  }

  async getProposals(universityId: string) {
    return prisma.proposal.findMany({
      where:   { universityId },
      include: { problem: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const universitiesService = new UniversitiesService();
