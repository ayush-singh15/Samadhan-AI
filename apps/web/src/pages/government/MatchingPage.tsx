import React, { useEffect, useState } from 'react';
import { problemsApi, type UniversityMatch } from '../../api/problems.api';
import type { Problem } from '../../types';
import { LoadingState } from '../../components/ui/States';

const MatchingPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [matchesByProblem, setMatchesByProblem] = useState<Record<string, UniversityMatch[]>>({});
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const all = await problemsApi.getAll();
        // Show active problems that need or have university matches
        const candidateProblems = all.filter(
          (p) => p.status === 'SUBMITTED' || p.status === 'ASSIGNED_TO_UNIVERSITY' || p.status === 'AI_CATEGORIZED'
        );
        setProblems(candidateProblems);

        // Fetch real AI matches for each problem
        const matchMap: Record<string, UniversityMatch[]> = {};
        await Promise.all(
          candidateProblems.map(async (p) => {
            const m = await problemsApi.getMatches(p.id);
            matchMap[p.id] = m;
          })
        );
        setMatchesByProblem(matchMap);
      } catch (err) {
        console.error('Failed to load matching pipeline:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleConfirm = async (problemId: string, universityId: string) => {
    setSubmitting(`${problemId}-${universityId}`);
    try {
      await problemsApi.assignUniversity(problemId, universityId);
      setConfirmed((prev) => new Set(prev).add(problemId));
    } catch (err: any) {
      alert(err.message || 'Failed to assign university mandate');
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface p-space-lg">
      <div className="max-w-6xl mx-auto flex flex-col gap-space-lg">

        {/* Header Ribbon */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-space-lg shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-space-xs mb-space-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">
                Automated Quad-Helix Routing Studio
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              AI University Matching Engine
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Multi-factor vector ranking analyzing semantic taxonomy, laboratory capacity, and regional proximity.
            </p>
          </div>

          <div className="flex items-center gap-space-sm">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps font-bold">
              Active Model: Domain-TFIDF-v1
            </span>
          </div>
        </div>

        {/* Content */}
        {loading && <LoadingState />}

        {!loading && problems.length === 0 && (
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-space-2xl text-center">
            <span className="material-symbols-outlined text-outline-variant text-[48px] mb-space-sm">
              check_circle
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
              No Pending Problems
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              All reported civic challenges have been processed and allocated to research nodes.
            </p>
          </div>
        )}

        {!loading && problems.map((problem) => {
          const matches = matchesByProblem[problem.id] || [];
          const isConfirmed = confirmed.has(problem.id) || problem.status === 'ASSIGNED_TO_UNIVERSITY';

          return (
            <div
              key={problem.id}
              className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-xs"
            >
              {/* Problem Case Header */}
              <div className="p-space-lg border-b border-outline-variant/20 bg-surface-container-low/40 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div>
                  <div className="flex items-center gap-space-xs mb-space-xs">
                    <span className="px-2 py-0.5 rounded-md bg-primary-container text-on-primary-container font-label-caps text-[10px] font-bold">
                      {problem.category.replace(/_/g, ' ')}
                    </span>
                    <span className="font-code text-code text-[11px] text-on-surface-variant">
                      #{problem.id.slice(0, 8)}
                    </span>
                    <span className="text-on-surface-variant text-[11px]">·</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">
                      {problem.district}, {problem.state}
                    </span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {problem.title}
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                    {problem.description}
                  </p>
                </div>

                {isConfirmed && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 font-label-caps text-label-caps font-bold">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Mandate Assigned ✓
                  </div>
                )}
              </div>

              {/* Ranked Academic Matches */}
              <div className="p-space-lg flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <h3 className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
                    Ranked Research Partners ({matches.length})
                  </h3>
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                    Sorted by composite suitability score
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {matches.map((m, i) => {
                    const isTop = i === 0;
                    const percent = Math.round(m.matchScore * 100);

                    return (
                      <div
                        key={m.universityId}
                        className={`rounded-xl border p-space-md flex flex-col justify-between transition-all ${
                          isTop
                            ? 'border-primary/40 bg-primary/[0.02] shadow-xs'
                            : 'border-outline-variant/30 bg-surface-container-low/20'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-space-sm mb-space-sm">
                            <div className="flex items-center gap-space-sm">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-headline-sm text-headline-sm text-on-primary ${
                                  isTop ? 'bg-primary' : 'bg-secondary'
                                }`}
                              >
                                #{i + 1}
                              </div>
                              <div>
                                <h4 className="font-label-lg text-label-lg text-on-surface font-bold leading-tight">
                                  {m.name}
                                </h4>
                                <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                                  {m.department} · {m.state}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="font-headline-md text-headline-md font-extrabold text-primary">
                                {percent}%
                              </span>
                              <p className="font-label-caps text-[9px] text-on-surface-variant uppercase">
                                Vector Match
                              </p>
                            </div>
                          </div>

                          <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px] mb-space-sm leading-relaxed">
                            {m.rationale}
                          </p>

                          {/* Intersecting Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-space-md">
                            {m.matchingTags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface font-label-caps text-[10px]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action CTA */}
                        <div className="pt-space-sm border-t border-outline-variant/20 flex items-center justify-between">
                          <span className="font-code text-code text-[11px] text-on-surface-variant">
                            Lead: {m.leadContact}
                          </span>

                          {!isConfirmed && (
                            <button
                              onClick={() => handleConfirm(problem.id, m.universityId)}
                              disabled={submitting === `${problem.id}-${m.universityId}`}
                              className={`px-3 py-1.5 rounded-lg font-label-lg text-label-lg transition-all flex items-center gap-1.5 ${
                                isTop
                                  ? 'bg-primary text-on-primary hover:bg-primary/90'
                                  : 'border border-outline-variant text-on-surface hover:bg-surface-container-high'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {isTop ? 'assignment_turned_in' : 'handshake'}
                              </span>
                              {submitting === `${problem.id}-${m.universityId}`
                                ? 'Assigning...'
                                : isTop
                                ? 'Issue Mandate'
                                : 'Select Node'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchingPage;
