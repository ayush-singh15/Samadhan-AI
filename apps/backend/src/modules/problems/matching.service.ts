import { prisma } from '../../config/db.config';

export interface UniversityMatchResult {
  universityId: string;
  name: string;
  code: string;
  department: string;
  state: string;
  matchScore: number;       // e.g. 0.94 (94%)
  matchingTags: string[];
  rationale: string;
  leadContact: string;
  activeLoad: number;
}

export class MatchingService {
  /**
   * Evaluates a problem against registered academic institutions using
   * domain taxonomy, keyword/tag intersection, geographic proximity, and active load.
   */
  async matchUniversitiesForProblem(problemId: string): Promise<UniversityMatchResult[]> {
    // 1. Fetch problem
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { assignedUniversity: true },
    });

    if (!problem) {
      throw new Error('Problem not found');
    }

    // 2. Fetch all university profiles with their current assigned problem load
    const universities = await prisma.universityProfile.findMany({
      include: {
        assignedProblems: {
          select: { id: true, status: true },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (universities.length === 0) {
      return [];
    }

    const textCorpus = `${problem.title} ${problem.description} ${problem.category}`.toLowerCase();
    const problemWords = new Set(
      textCorpus
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );

    // 3. Score each university
    const results: UniversityMatchResult[] = universities.map((uni) => {
      // a. Tag & Keyword Overlap (W_tags = 0.40)
      const matchingTags: string[] = [];
      let tagHits = 0;

      uni.expertiseTags.forEach((tag) => {
        const tagLower = tag.toLowerCase();
        const tagParts = tagLower.split(/\s+/);
        const matchesTag = tagParts.some((part) => problemWords.has(part) || textCorpus.includes(part));

        if (matchesTag) {
          tagHits += 1;
          matchingTags.push(tag);
        }
      });

      const tagScore = uni.expertiseTags.length > 0
        ? Math.min(1.0, (tagHits / Math.min(3, uni.expertiseTags.length)) * 0.9 + 0.1)
        : 0.3;

      // b. Category & Department Alignment (W_cat = 0.35)
      let catScore = 0.4;
      const deptLower = uni.department.toLowerCase();
      const catLower = problem.category.toLowerCase();

      if (
        (catLower.includes('water') && (deptLower.includes('environmental') || deptLower.includes('civil'))) ||
        (catLower.includes('agri') && (deptLower.includes('agri') || deptLower.includes('energy') || deptLower.includes('mechanical'))) ||
        (catLower.includes('infra') && (deptLower.includes('civil') || deptLower.includes('structural'))) ||
        (catLower.includes('energy') && (deptLower.includes('electrical') || deptLower.includes('energy'))) ||
        (catLower.includes('health') && (deptLower.includes('biotech') || deptLower.includes('health')))
      ) {
        catScore = 0.95;
      } else if (matchingTags.length > 0) {
        catScore = 0.75;
      }

      // c. Geographic Proximity (W_geo = 0.15)
      const geoScore = uni.state.toLowerCase() === problem.state.toLowerCase() ? 1.0 : 0.45;

      // d. Capacity & Active Load (W_cap = 0.10)
      const activeProblems = uni.assignedProblems.filter((p) => p.status !== 'RESOLVED');
      const activeLoad = activeProblems.length;
      const capScore = Math.max(0.3, 1.0 - activeLoad * 0.15);

      // Composite Weighted Score
      const rawScore = catScore * 0.35 + tagScore * 0.40 + geoScore * 0.15 + capScore * 0.10;
      const matchScore = Math.round(Math.min(0.98, Math.max(0.55, rawScore)) * 100) / 100;

      // Build explanation rationale
      let rationale = `Recommended for ${problem.category.replace(/_/g, ' ')} with ${matchingTags.length} intersecting competencies`;
      if (geoScore === 1.0) {
        rationale += ` in ${uni.state} jurisdiction.`;
      } else {
        rationale += ` as a national research center.`;
      }

      return {
        universityId: uni.id,
        name: uni.name,
        code: uni.code,
        department: uni.department,
        state: uni.state,
        matchScore,
        matchingTags: matchingTags.length > 0 ? matchingTags : uni.expertiseTags.slice(0, 2),
        rationale,
        leadContact: uni.user?.name || uni.contactEmail,
        activeLoad,
      };
    });

    // 4. Sort descending by score
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }
}

export const matchingService = new MatchingService();
