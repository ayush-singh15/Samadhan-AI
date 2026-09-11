import React, { useEffect, useState } from 'react';
import { problemsApi } from '../../api/problems.api';
import { mock_matches, mock_universities } from '../../mocks';
import type { Problem } from '../../types';
import { LoadingState } from '../../components/ui/States';

const MatchingPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    // Show problems that are ASSIGNED_TO_UNIVERSITY (ready for matching confirmation)
    problemsApi.getAll()
      .then((all) => setProblems(all.filter((p) => p.status === 'ASSIGNED_TO_UNIVERSITY')))
      .catch(() => setProblems([]))
      .finally(() => setLoading(false));
  }, []);

  const handleConfirm = async (problemId: string, universityId: string) => {
    setSubmitting(`${problemId}-${universityId}`);
    try {
      // TODO: call POST /api/v1/problems/:problemId/assign { universityId }
      // This endpoint is not yet implemented in the backend.
      await new Promise((r) => setTimeout(r, 500));
      setConfirmed((prev) => new Set(prev).add(problemId));
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.inner}>
          <h1 style={s.pageTitle}>University Matching</h1>
          <p style={s.pageSubtitle}>Review suggested university matches for approved problems</p>
        </div>
      </div>

      <div style={s.content}>
        {/* NOTE — AI matching service not yet built */}
        <div style={s.notice}>
          <strong>ℹ AI Matching:</strong> The automated university suggestion service is not yet active. Suggestions below are mock data for demonstration.
        </div>

        {loading && <LoadingState />}
        {!loading && problems.length === 0 && (
          <div style={s.empty}><p>No problems currently awaiting university matching.</p></div>
        )}

        {!loading && problems.map((problem) => {
          // TODO: replace with real AI-match API call when available
          const matches = mock_matches;
          const isConfirmed = confirmed.has(problem.id);

          return (
            <div key={problem.id} style={s.block}>
              <div style={s.blockHeader}>
                <div>
                  <h2 style={s.blockTitle}>{problem.title}</h2>
                  <p style={s.blockMeta}>{problem.category.replace(/_/g, ' ')} · {problem.district}, {problem.state}</p>
                </div>
                {isConfirmed && <span style={s.confirmedBadge}>Confirmed ✓</span>}
              </div>

              <div style={s.matchList}>
                {matches.map((m, i) => (
                  <div key={m.universityId} style={s.matchCard}>
                    <div style={s.rank}>#{i + 1}</div>
                    <div style={s.matchInfo}>
                      <p style={s.matchUniv}>{m.universityName}</p>
                      <p style={s.matchDept}>{m.department}</p>
                      <p style={s.matchReason}>{m.matchReason}</p>
                    </div>
                    <div style={s.matchRight}>
                      <span style={s.matchScore}>{Math.round(m.matchScore * 100)}%</span>
                      <span style={s.matchScoreLabel}>match</span>
                      {!isConfirmed && (
                        <button
                          onClick={() => handleConfirm(problem.id, m.universityId)}
                          disabled={submitting === `${problem.id}-${m.universityId}`}
                          style={{ ...(i === 0 ? s.confirmBtn : s.selectBtn), opacity: submitting ? 0.6 : 1 }}
                        >
                          {submitting === `${problem.id}-${m.universityId}` ? '…' : i === 0 ? 'Confirm Match' : 'Select'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'Inter, system-ui, sans-serif', color: '#111827', minHeight: '100%' },
  pageHeader: { background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '1.5rem' },
  inner: { maxWidth: '1100px', margin: '0 auto' },
  pageTitle: { fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.01em' },
  pageSubtitle: { fontSize: '0.875rem', color: '#6b7280' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' },
  notice: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#92400e', marginBottom: '1.5rem', lineHeight: 1.5 },
  empty: { textAlign: 'center' as const, padding: '3rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', color: '#6b7280' },
  block: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', marginBottom: '1.5rem', overflow: 'hidden' },
  blockHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f4f6', gap: '1rem', flexWrap: 'wrap' as const },
  blockTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem', color: '#111827' },
  blockMeta: { fontSize: '0.8125rem', color: '#6b7280' },
  confirmedBadge: { fontSize: '0.75rem', fontWeight: 600, color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '3px', padding: '0.2rem 0.625rem', whiteSpace: 'nowrap' as const },
  matchList: { padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' },
  matchCard: { display: 'flex', gap: '1rem', padding: '1rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px', alignItems: 'flex-start', flexWrap: 'wrap' as const },
  rank: { width: '28px', height: '28px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', flexShrink: 0 },
  matchInfo: { flex: 1, minWidth: 0 },
  matchUniv: { fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.125rem', color: '#111827' },
  matchDept: { fontSize: '0.8125rem', color: '#6b7280', marginBottom: '0.375rem' },
  matchReason: { fontSize: '0.8125rem', color: '#374151', lineHeight: 1.5 },
  matchRight: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '0.25rem', flexShrink: 0, minWidth: '90px' },
  matchScore: { fontSize: '1.375rem', fontWeight: 700, color: '#1d4ed8', lineHeight: 1 },
  matchScoreLabel: { fontSize: '0.6875rem', color: '#6b7280', textTransform: 'uppercase' as const },
  confirmBtn: { marginTop: '0.5rem', padding: '0.375rem 0.875rem', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' as const },
  selectBtn: { marginTop: '0.5rem', padding: '0.375rem 0.875rem', background: 'transparent', color: '#374151', border: '1px solid #d1d5db', borderRadius: '3px', fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' as const },
};

export default MatchingPage;
