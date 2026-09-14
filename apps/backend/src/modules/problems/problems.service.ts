import { prisma } from '../../config/db.config';
import { ProblemCategory, ProblemStatus } from '@prisma/client';
import { matchingService } from './matching.service';
import { notificationsService } from '../notifications/notifications.service';
import { eventsService } from '../events/events.service';

export function computeAiThreatAnalysis(title: string, description: string, category?: string) {
  const text = `${title} ${description}`.toLowerCase();

  // Category base weighting
  let baseScore = 20;
  if (category === 'HEALTHCARE') baseScore = 35;
  else if (category === 'WATER_SANITATION') baseScore = 32;
  else if (category === 'INFRASTRUCTURE') baseScore = 28;
  else if (category === 'AGRICULTURE') baseScore = 24;
  else if (category === 'ENERGY') baseScore = 22;

  // Urgency & hazard keyword detection
  const urgentKeywords = [
    'urgent', 'danger', 'hazardous', 'collapse', 'contamination', 'hospital',
    'children', 'fatal', 'accident', 'overflow', 'poison', 'emergency',
    'broken', 'electricity shock', 'flooding', 'fire'
  ];
  let urgencyBonus = 0;
  urgentKeywords.forEach((k) => {
    if (text.includes(k)) urgencyBonus += 8;
  });
  urgencyBonus = Math.min(urgencyBonus, 40);

  // Impact scope factor
  const scopeKeywords = ['ward', 'village', 'colony', 'thousands', 'entire area', 'months', 'daily', 'school'];
  let scopeBonus = 0;
  scopeKeywords.forEach((k) => {
    if (text.includes(k)) scopeBonus += 7;
  });
  scopeBonus = Math.min(scopeBonus, 25);

  const severityScore = Math.min(100, Math.max(15, baseScore + urgencyBonus + scopeBonus));

  // AI Technical Domain extraction
  const domains: string[] = [];
  if (/water|contaminat|sewage|drain|pipe|tank/i.test(text)) domains.push('Hydraulic & Water Treatment');
  if (/road|bridge|pothole|structural|concrete|building|crack/i.test(text)) domains.push('Civil Structural Engineering');
  if (/electric|wire|transformer|voltage|power|grid/i.test(text)) domains.push('Electrical Grid & Power Systems');
  if (/crop|pest|soil|farm|irrigation|harvest/i.test(text)) domains.push('Agritech & Soil Dynamics');
  if (/waste|plastic|garbage|dump|sanitation/i.test(text)) domains.push('Solid Waste Environmental Eng.');
  if (/sensor|iot|camera|automate|monitor/i.test(text)) domains.push('Embedded IoT Telemetry');
  if (domains.length === 0) domains.push('Municipal Public Works');

  return { severityScore, technicalDomains: domains };
}

export class ProblemsService {
  async getAllProblems(filters?: {
    status?: string;
    category?: string;
    district?: string;
    search?: string;
    minSeverity?: number;
  }) {
    const problems = await prisma.problem.findMany({
      where: {
        ...(filters?.status   && { status:   filters.status   as ProblemStatus }),
        ...(filters?.category && { category: filters.category as ProblemCategory }),
        ...(filters?.district && { district: { contains: filters.district, mode: 'insensitive' } }),
        ...(filters?.search && {
          OR: [
            { title:       { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
            { address:     { contains: filters.search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        submittedBy:        { select: { id: true, name: true, email: true } },
        assignedUniversity: { select: { id: true, name: true, code: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Enrich with computed AI Threat analysis
    const enriched = problems.map((p) => {
      const ai = computeAiThreatAnalysis(p.title, p.description, p.category);
      return {
        ...p,
        aiSeverity: ai.severityScore,
        technicalDomains: ai.technicalDomains,
      };
    });

    if (filters?.minSeverity) {
      return enriched.filter((p) => p.aiSeverity >= (filters.minSeverity || 0));
    }

    return enriched;
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

    const ai = computeAiThreatAnalysis(problem.title, problem.description, problem.category);
    return {
      ...problem,
      aiSeverity: ai.severityScore,
      technicalDomains: ai.technicalDomains,
    };
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
    const problem = await prisma.problem.create({
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

    const ai = computeAiThreatAnalysis(problem.title, problem.description, problem.category);

    eventsService.broadcast({
      type: 'PROBLEM_LOGGED',
      title: 'New Civic Problem Reported',
      message: `Citizen reported: "${problem.title}" in ${problem.district}, ${problem.state} (Threat Index: ${ai.severityScore}/100).`,
      payload: {
        id: problem.id,
        title: problem.title,
        district: problem.district,
        aiSeverity: ai.severityScore,
        technicalDomains: ai.technicalDomains,
      },
    });

    return {
      ...problem,
      aiSeverity: ai.severityScore,
      technicalDomains: ai.technicalDomains,
    };
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

    eventsService.broadcast({
      type: 'MANDATE_ASSIGNED',
      title: 'R&D Mandate Dispatched',
      message: `Zonal Admin assigned "${problem.title}" to ${problem.assignedUniversity?.name || 'Academic Lab'}.`,
      payload: { problemId, universityId },
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

    eventsService.broadcast({
      type: 'SOCIAL_AUDIT_CERTIFIED',
      title: 'Community Social Audit Verified',
      message: `Citizen verified solution for "${problem.title}" with ${feedback.rating}/5 stars rating.`,
      payload: { problemId, rating: feedback.rating, helped: feedback.helped },
    });

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
