import { prisma } from '../../config/db.config';
import { notificationsService } from '../notifications/notifications.service';

export class ProjectsService {
  async getAll() {
    return prisma.project.findMany({
      include: {
        proposal: {
          include: {
            problem: true,
            university: { select: { id: true, name: true, code: true, department: true } },
          },
        },
        milestones: true,
        fundingOffers: {
          include: {
            industryProfile: { select: { id: true, companyName: true, contactEmail: true } },
          },
        },
        industry: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        proposal: {
          include: {
            problem: true,
            university: { select: { id: true, name: true, code: true, department: true } },
          },
        },
        milestones: true,
        fundingOffers: {
          include: {
            industryProfile: { select: { id: true, companyName: true, contactEmail: true } },
          },
        },
        industry: true,
      },
    });
    if (!project) throw new Error('Project not found');
    return project;
  }

  async createProposal(data: {
    problemId: string;
    universityId?: string;
    title: string;
    abstract: string;
    budgetRequired: number;
    timelineMonths: number;
  }, userId?: string) {
    let resolvedUniId = data.universityId;

    // If universityId not provided in body, resolve from authenticated user profile
    if (!resolvedUniId && userId) {
      const profile = await prisma.universityProfile.findUnique({ where: { userId } });
      if (profile) resolvedUniId = profile.id;
    }

    // Fallback to first registered university if not bound
    if (!resolvedUniId) {
      const first = await prisma.universityProfile.findFirst();
      if (!first) throw new Error('No university profiles registered');
      resolvedUniId = first.id;
    }

    // 1. Create Proposal
    const proposal = await prisma.proposal.create({
      data: {
        problemId: data.problemId,
        universityId: resolvedUniId,
        title: data.title,
        abstract: data.abstract,
        budgetRequired: Number(data.budgetRequired),
        timelineMonths: Number(data.timelineMonths),
        status: 'SUBMITTED',
      },
      include: {
        problem: true,
        university: true,
      },
    });

    // 2. Update Problem Status to PROPOSAL_SUBMITTED
    await prisma.problem.update({
      where: { id: data.problemId },
      data: { status: 'PROPOSAL_SUBMITTED' },
    });

    // 3. Notify Zonal Admins & Citizen
    if (proposal.problem?.submittedById) {
      await notificationsService.sendTriggerNotification(
        proposal.problem.submittedById,
        'Research Proposal Submitted',
        `${proposal.university.name} submitted a formal engineering proposal for "${proposal.problem.title}".`,
        'PROPOSAL_SUBMITTED'
      ).catch(() => {});
    }

    return proposal;
  }

  async getAllProposals(filters?: { status?: string; universityId?: string }) {
    return prisma.proposal.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.universityId && { universityId: filters.universityId }),
      },
      include: {
        problem: { select: { id: true, title: true, district: true, state: true, category: true } },
        university: { select: { id: true, name: true, code: true, department: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateProposalStatus(id: string, status: string) {
    const proposal = await prisma.proposal.update({
      where: { id },
      data: { status },
      include: {
        problem: true,
        university: true,
      },
    });

    // When proposal is APPROVED -> auto-generate Project with 3 milestone tranches
    if (status === 'APPROVED') {
      // Check if project already exists
      const existing = await prisma.project.findUnique({ where: { proposalId: proposal.id } });
      if (!existing) {
        const now = Date.now();
        await prisma.project.create({
          data: {
            proposalId: proposal.id,
            title: `Project: ${proposal.title}`,
            status: 'IN_DEVELOPMENT',
            fundedAmount: proposal.budgetRequired,
            milestones: {
              create: [
                {
                  title: 'M1: Research Baseline, Material Testing & Model Simulation',
                  description: 'Initial site telemetry diagnostics, material sourcing, and prototype simulation.',
                  dueDate: new Date(now + 30 * 24 * 60 * 60 * 1000),
                  isCompleted: false,
                  fundingPercentage: 30,
                },
                {
                  title: 'M2: Physical Prototype Deployment & Field Verification',
                  description: 'Commissioning hardware unit on-site and conducting 30-day continuous stress tests.',
                  dueDate: new Date(now + 60 * 24 * 60 * 60 * 1000),
                  isCompleted: false,
                  fundingPercentage: 40,
                },
                {
                  title: 'M3: Citizen Social Audit, Handover & Telemetry Integration',
                  description: 'Official handover to local municipal ward and public telemetry ledger onboarding.',
                  dueDate: new Date(now + 120 * 24 * 60 * 60 * 1000),
                  isCompleted: false,
                  fundingPercentage: 30,
                },
              ],
            },
          },
        });
      }

      // Advance Problem Status to IN_PROGRESS
      if (proposal.problemId) {
        await prisma.problem.update({
          where: { id: proposal.problemId },
          data: { status: 'IN_PROGRESS' },
        });
      }

      // Notify University Lead
      if (proposal.university?.userId) {
        await notificationsService.sendTriggerNotification(
          proposal.university.userId,
          'Proposal Approved & Project Initiated',
          `Your proposal for "${proposal.problem?.title}" was approved! Milestone tranches have been unlocked.`,
          'PROPOSAL_APPROVED'
        ).catch(() => {});
      }
    }

    return proposal;
  }

  async updateMilestone(projectId: string, milestoneId: string, isCompleted: boolean) {
    const updatedMs = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { isCompleted },
    });

    // Check if all milestones for this project are now completed
    const allMilestones = await prisma.milestone.findMany({ where: { projectId } });
    const allDone = allMilestones.length > 0 && allMilestones.every((m) => m.isCompleted);

    if (allDone) {
      const project = await prisma.project.update({
        where: { id: projectId },
        data: { status: 'COMPLETED' },
        include: { proposal: true },
      });

      if (project.proposal?.problemId) {
        await prisma.problem.update({
          where: { id: project.proposal.problemId },
          data: { status: 'RESOLVED' },
        });
      }
    }

    return updatedMs;
  }

  async getUniversityProjects(universityId: string) {
    return prisma.project.findMany({
      where: { proposal: { universityId } },
      include: {
        proposal: { include: { problem: true } },
        milestones: true,
        fundingOffers: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const projectsService = new ProjectsService();
