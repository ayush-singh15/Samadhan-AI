import { prisma } from '../../config/db.config';
import { ProblemCategory, ProblemStatus } from '@prisma/client';

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

  async assignUniversity(problemId: string, universityId: string) {
    return prisma.problem.update({
      where: { id: problemId },
      data:  { assignedUniversityId: universityId, status: 'ASSIGNED_TO_UNIVERSITY' },
    });
  }

  async getMyProblems(userId: string) {
    return prisma.problem.findMany({
      where:   { submittedById: userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const problemsService = new ProblemsService();
