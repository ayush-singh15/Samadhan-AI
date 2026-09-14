import { prisma } from '../../config/db.config';
import { notificationsService } from '../notifications/notifications.service';

export class IndustryService {
  async getIndustryPartners() {
    return prisma.industryProfile.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        projectsFunded: { select: { id: true, title: true, status: true, fundedAmount: true } },
      },
      orderBy: { companyName: 'asc' },
    });
  }

  async getPartnerById(id: string) {
    const partner = await prisma.industryProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        fundingOffers: { include: { project: true } },
        projectsFunded: { include: { milestones: true } },
      },
    });
    if (!partner) throw new Error('Industry partner not found');
    return partner;
  }

  async createProfile(data: {
    companyName: string;
    registrationNumber: string;
    csrFocusAreas: string[];
    totalBudgetAllocated: number;
    contactEmail: string;
  }, userId: string) {
    return prisma.industryProfile.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async createFundingOffer(projectId: string, amount: number, userId?: string) {
    let industryProfileId: string;

    if (userId) {
      const profile = await prisma.industryProfile.findUnique({ where: { userId } });
      if (profile) {
        industryProfileId = profile.id;
      } else {
        const first = await prisma.industryProfile.findFirst();
        if (!first) throw new Error('No industry profiles exist');
        industryProfileId = first.id;
      }
    } else {
      const first = await prisma.industryProfile.findFirst();
      if (!first) throw new Error('No industry profiles exist');
      industryProfileId = first.id;
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { proposal: { include: { university: true } } },
    });
    if (!project) throw new Error('Project not found');

    const offer = await prisma.fundingOffer.create({
      data: {
        projectId,
        industryProfileId,
        amountOffered: amount,
        status: 'COMMITTED',
      },
      include: {
        project: true,
        industryProfile: true,
      },
    });

    const updatedIndustry = await prisma.industryProfile.update({
      where: { id: industryProfileId },
      data: {
        totalBudgetCommitted: { increment: amount },
      },
    });

    const newFundedAmount = project.fundedAmount + amount;
    const isFullyFunded = project.proposal ? newFundedAmount >= project.proposal.budgetRequired : false;

    await prisma.project.update({
      where: { id: projectId },
      data: {
        fundedAmount: { increment: amount },
        ...(!project.industryId && { industryId: industryProfileId }),
        ...(isFullyFunded && { status: 'FULLY_FUNDED' }),
      },
    });

    if (project.proposal?.university?.userId) {
      await notificationsService.sendTriggerNotification(
        project.proposal.university.userId,
        'CSR Grant Allocated',
        `₹${(amount / 100000).toFixed(2)} Lakhs CSR grant committed by ${updatedIndustry.companyName} for "${project.title}".`,
        'GRANT_ALLOCATED'
      ).catch(() => {});
    }

    return offer;
  }

  async getDashboardMetrics(userId?: string) {
    let industryProfile = null;
    if (userId) {
      industryProfile = await prisma.industryProfile.findUnique({
        where: { userId },
        include: {
          fundingOffers: {
            include: {
              project: {
                include: {
                  proposal: { include: { problem: true, university: true } },
                  milestones: true,
                },
              },
            },
          },
          projectsFunded: {
            include: {
              proposal: { include: { problem: true, university: true } },
              milestones: true,
            },
          },
        },
      });
    }

    if (!industryProfile) {
      industryProfile = await prisma.industryProfile.findFirst({
        include: {
          fundingOffers: {
            include: {
              project: {
                include: {
                  proposal: { include: { problem: true, university: true } },
                  milestones: true,
                },
              },
            },
          },
          projectsFunded: {
            include: {
              proposal: { include: { problem: true, university: true } },
              milestones: true,
            },
          },
        },
      });
    }

    if (!industryProfile) {
      return {
        profile: null,
        stats: {
          totalAllocated: 0,
          totalCommitted: 0,
          activeProjectsCount: 0,
          completedProjectsCount: 0,
          milestonesFunded: 0,
        },
        projects: [],
      };
    }

    const projectMap = new Map<string, any>();
    industryProfile.projectsFunded.forEach((p) => projectMap.set(p.id, p));
    industryProfile.fundingOffers.forEach((fo) => {
      if (fo.project && !projectMap.has(fo.project.id)) {
        projectMap.set(fo.project.id, fo.project);
      }
    });

    const projectsList = Array.from(projectMap.values());
    const activeProjectsCount = projectsList.filter((p) => p.status !== 'COMPLETED').length;
    const completedProjectsCount = projectsList.filter((p) => p.status === 'COMPLETED').length;
    const milestonesFunded = projectsList.reduce((acc, p) => acc + (p.milestones ? p.milestones.length : 0), 0);

    return {
      profile: {
        id: industryProfile.id,
        companyName: industryProfile.companyName,
        registrationNumber: industryProfile.registrationNumber,
        csrFocusAreas: industryProfile.csrFocusAreas,
        totalBudgetAllocated: industryProfile.totalBudgetAllocated,
        totalBudgetCommitted: industryProfile.totalBudgetCommitted,
        contactEmail: industryProfile.contactEmail,
      },
      stats: {
        totalAllocated: industryProfile.totalBudgetAllocated,
        totalCommitted: industryProfile.totalBudgetCommitted,
        activeProjectsCount,
        completedProjectsCount,
        milestonesFunded,
      },
      projects: projectsList,
    };
  }
}

export const industryService = new IndustryService();
