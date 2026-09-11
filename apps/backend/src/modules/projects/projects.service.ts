import { prisma } from '../../config/db.config';

export class ProjectsService {
  async getAll() {
    return prisma.project.findMany({
      include: {
        proposal:     { include: { problem: true, university: true } },
        milestones:   true,
        fundingOffers: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        proposal:      { include: { problem: true, university: true } },
        milestones:    true,
        fundingOffers: { include: { industryProfile: true } },
        industry:      true,
      },
    });
    if (!project) throw new Error('Project not found');
    return project;
  }

  async createProposal(data: {
    problemId: string;
    universityId: string;
    title: string;
    abstract: string;
    budgetRequired: number;
    timelineMonths: number;
  }) {
    return prisma.proposal.create({ data: { ...data, status: 'SUBMITTED' } });
  }

  async getAllProposals(filters?: { status?: string; universityId?: string }) {
    return prisma.proposal.findMany({
      where: {
        ...(filters?.status      && { status: filters.status }),
        ...(filters?.universityId && { universityId: filters.universityId }),
      },
      include: {
        problem:    { select: { id: true, title: true, district: true, state: true } },
        university: { select: { id: true, name: true, code: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateProposalStatus(id: string, status: string) {
    const proposal = await prisma.proposal.update({
      where: { id },
      data:  { status },
    });

    // Auto-create project when proposal is APPROVED
    if (status === 'APPROVED') {
      await prisma.project.create({
        data: {
          proposalId: proposal.id,
          title:      `Project: ${proposal.title}`,
          status:     'IN_DEVELOPMENT',
        },
      });
    }
    return proposal;
  }

  async updateMilestone(projectId: string, milestoneId: string, isCompleted: boolean) {
    return prisma.milestone.update({
      where: { id: milestoneId },
      data:  { isCompleted },
    });
  }

  async getUniversityProjects(universityId: string) {
    return prisma.project.findMany({
      where:   { proposal: { universityId } },
      include: { proposal: { include: { problem: true } }, milestones: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const projectsService = new ProjectsService();
