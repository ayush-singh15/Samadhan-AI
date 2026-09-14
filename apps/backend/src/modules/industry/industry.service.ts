import { prisma } from '../../config/db.config';

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
      if (!profile) throw new Error('Industry profile required to fund projects');
      industryProfileId = profile.id;
    } else {
      // Fallback to first industry profile if not bound
      const first = await prisma.industryProfile.findFirst();
      if (!first) throw new Error('No industry profiles exist');
      industryProfileId = first.id;
    }

    const offer = await prisma.fundingOffer.create({
      data: {
        projectId,
        industryProfileId,
        amountOffered: amount,
        status: 'PENDING',
      },
      include: {
        project: true,
        industryProfile: true,
      },
    });

    // Update industry totalBudgetCommitted
    await prisma.industryProfile.update({
      where: { id: industryProfileId },
      data: {
        totalBudgetCommitted: { increment: amount },
      },
    });

    return offer;
  }
}

export const industryService = new IndustryService();
