import { prisma } from '../../config/db.config';
import { ProblemCategory, ProblemStatus } from '@prisma/client';
import { matchingService } from './matching.service';
import { notificationsService } from '../notifications/notifications.service';

export class ProblemsService {
  async getAllProblems(filters?: { status?: string; category?: string }) {
    return prisma.problem.findMany({
      where: {
        ...(filters?.status   && { status:   filters.status   as ProblemStatus }),
        ...(filters?.category && { category: filters.category as ProblemCategory }),
      },
      include: {
        submittedBy:        { select: { id: true, name: true, email: true } },
        assignedUniversity: { select: { id: true, name: true, code: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProblemById(id: string) {
    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        submittedBy:        { select: { id: true, name: true, email: true } },
        assignedUniversity: { select: { id: true, name: true, code: true, department: true } },
        proposals:          { include: { university: { select: { id: true, name: true } } } },
        feedback:           { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!problem) throw new Error('Problem not found');
    return problem;
  }

  async createProblem(data: {
    title: string;
    description: string;
    category?: string;
    latitude: number;
    longitude: number;
    address: string;
    district: string;
    state: string;
    mediaUrls?: string[];
  }, userId: string) {
    return prisma.problem.create({
      data: {
        title:       data.title,
        description: data.description,
        category:    (data.category as ProblemCategory) || 'OTHER',
        latitude:    data.latitude,
        longitude:   data.longitude,
        address:     data.address,
        district:    data.district,
        state:       data.state,
        mediaUrls:   data.mediaUrls || [],
        submittedById: userId,
        status:      'SUBMITTED',
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return prisma.problem.update({
      where: { id },
      data:  { status: status as ProblemStatus },
    });
  }

  async getMatches(problemId: string) {
    return matchingService.matchUniversitiesForProblem(problemId);
  }

  async assignUniversity(problemId: string, universityId: string) {
    const problem = await prisma.problem.update({
      where: { id: problemId },
      data:  { assignedUniversityId: universityId, status: 'ASSIGNED_TO_UNIVERSITY' },
      include: {
        assignedUniversity: true,
      },
    });

    // Notify University Lead
    if (problem.assignedUniversity?.userId) {
      await notificationsService.sendTriggerNotification(
        problem.assignedUniversity.userId,
        'New Problem Mandate Assigned',
        `Administration assigned "${problem.title}" to your institution. Please review and submit a proposal.`,
        'MANDATE_ASSIGNED'
      ).catch(() => {});
    }

    // Notify Reporting Citizen
    if (problem.submittedById) {
      await notificationsService.sendTriggerNotification(
        problem.submittedById,
        'Problem Assigned to University',
        `Your report "${problem.title}" was assigned to ${problem.assignedUniversity?.name || 'an academic institution'} for feasibility review.`,
        'PROBLEM_ASSIGNED'
      ).catch(() => {});
    }

    return problem;
  }

  async getMyProblems(userId: string) {
    return prisma.problem.findMany({
      where:   { submittedById: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async submitFeedback(problemId: string, data: { rating: number; helped: boolean; comment?: string }, userId?: string) {
    const problem = await prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) throw new Error('Problem not found');

    const feedback = await prisma.citizenFeedback.create({
      data: {
        problemId,
        userId: userId || null,
        rating: Math.min(5, Math.max(1, Math.round(data.rating))),
        helped: Boolean(data.helped),
        comment: data.comment || null,
      },
    });

    if (data.helped && problem.status === 'IN_PROGRESS') {
      await prisma.problem.update({
        where: { id: problemId },
        data: { status: 'RESOLVED' },
      });
    }

    if (problem.submittedById) {
      await notificationsService.sendTriggerNotification(
        problem.submittedById,
        'Citizen Feedback Recorded',
        `Social audit feedback received for "${problem.title}". Rating: ${feedback.rating}/5 stars.`,
        'FEEDBACK_RECORDED'
      ).catch(() => {});
    }

    return feedback;
  }

  async getFeedback(problemId: string) {
    return prisma.citizenFeedback.findMany({
      where: { problemId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const problemsService = new ProblemsService();
