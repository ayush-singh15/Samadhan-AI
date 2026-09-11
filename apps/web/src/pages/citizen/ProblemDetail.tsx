import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { problemsApi } from '../../api/problems.api';
import StatusBadge from '../../components/ui/StatusBadge';
import { LoadingState, ErrorState } from '../../components/ui/States';
import type { Problem, ProblemStatus } from '../../types';

// Timeline matches Prisma ProblemStatus progression
const TIMELINE: { status: ProblemStatus; label: string }[] = [
  { status: 'SUBMITTED',              label: 'Submitted' },
  { status: 'AI_CATEGORIZED',         label: 'AI Categorised' },
  { status: 'ASSIGNED_TO_UNIVERSITY', label: 'Assigned to University' },
  { status: 'PROPOSAL_SUBMITTED',     label: 'Proposal Submitted' },
  { status: 'FUNDING_APPROVED',       label: 'Funding Approved' },
  { status: 'IN_PROGRESS',            label: 'Solution in Progress' },
  { status: 'RESOLVED',               label: 'Resolved' },
];

const STATUS_INDEX: Record<string, number> = Object.fromEntries(
  TIMELINE.map((t, i) => [t.status, i])
);

const ProblemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    problemsApi.getById(id)
      .then((p) => {
        if (p) setProblem(p);
        else setError('Problem not found.');
      })
      .catch(() => setError('Unable to load problem details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={s.page}><div style={s.content}><LoadingState /></div></div>;
  if (error || !problem) return <div style={s.page}><div style={s.content}><ErrorState message={error ?? 'Problem not found.'} /><Link to="/citizen/problems" style={s.backLink}>← Back to problems</Link></div></div>;

  const currentIdx = STATUS_INDEX[problem.status] ?? 0;

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.inner}>
          <Link to="/citizen/problems" style={s.backLink}>← My Problems</Link>
          <div style={s.headerRow}>
            <h1 style={s.pageTitle}>{problem.title}</h1>
            <StatusBadge status={problem.status} />
          </div>
          <p style={s.pageSubtitle}>
            {problem.category.replace(/_/g, ' ')} · {problem.address}, {problem.district}, {problem.state}
          </p>
          <p style={s.pageDate}>Submitted {new Date(problem.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div style={s.content}>
        <div style={s.layout}>
          {/* Main column */}
          <main>
            <section style={s.card}>
              <h2 style={s.cardTitle}>Problem Description</h2>
              <p style={s.description}>{problem.description}</p>
            </section>

            {/* AI category note */}
            {problem.aiCategory && (
              <section style={s.card} aria-labelledby="ai-heading">
                <h2 id="ai-heading" style={s.cardTitle}>AI Suggested Category</h2>
                <p style={s.aiNote}>
                  The system automatically suggested this category based on the problem description. An admin will confirm or override this before assigning to a university.
                </p>
                <div style={s.aiResult}>
                  <strong style={s.aiCategory}>{problem.aiCategory}</strong>
                  {problem.aiConfidence !== undefined && (
                    <span style={s.aiConfidence}>{Math.round(problem.aiConfidence * 100)}% confidence</span>
                  )}
                </div>
              </section>
            )}

            {/* Similar problems */}
            {problem.similarProblems && problem.similarProblems.length > 0 && (
              <section style={s.card} aria-labelledby="sim-heading">
                <h2 id="sim-heading" style={s.cardTitle}>Possible Similar Problems</h2>
                <p style={s.aiNote}>These existing problems may be related. An admin will review before proceeding.</p>
                {problem.similarProblems.map((sp) => (
                  <div key={sp.problemId} style={s.simRow}>
                    <span style={s.simTitle}>{sp.title}</span>
                    <span style={s.simScore}>{Math.round(sp.similarity * 100)}% similar</span>
                  </div>
                ))}
              </section>
            )}

            {/* Media */}
            {problem.mediaUrls && problem.mediaUrls.length > 0 && (
              <section style={s.card}>
                <h2 style={s.cardTitle}>Attached Media</h2>
                <div style={s.mediaGrid}>
                  {problem.mediaUrls.map((url, i) => (
                    <img key={i} src={url} alt={`Attachment ${i + 1}`} style={s.mediaImg} loading="lazy" />
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside>
            {/* Progress timeline */}
            <section style={s.card} aria-labelledby="timeline-heading">
              <h2 id="timeline-heading" style={s.cardTitle}>Progress</h2>
              <ol style={s.timeline}>
                {TIMELINE.map((step, i) => {
                  const done = i < currentIdx;
                  const active = i === currentIdx;
                  return (
                    <li key={step.status} style={s.timelineItem}>
                      <div style={{ ...s.dot, ...(done ? s.dotDone : active ? s.dotActive : s.dotPending) }}>
                        {done ? '✓' : i + 1}
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: active ? 700 : 400, color: done || active ? '#111827' : '#9ca3af' }}>
                        {step.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* Feedback CTA */}
            {problem.status === 'RESOLVED' && (
              <div style={s.feedbackCard}>
                <p style={s.feedbackText}>This problem has been resolved. Please share your feedback.</p>
                <Link to={`/citizen/feedback/${problem.id}`} style={s.feedbackBtn}>Give Feedback</Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'Inter, system-ui, sans-serif', color: '#111827', minHeight: '100%' },
  pageHeader: { background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '1.5rem' },
  inner: { maxWidth: '1100px', margin: '0 auto' },
  backLink: { display: 'inline-block', fontSize: '0.8125rem', color: '#1d4ed8', textDecoration: 'none', marginBottom: '0.75rem', fontWeight: 500 },
  headerRow: { display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' as const, marginBottom: '0.375rem' },
  pageTitle: { fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.01em', flex: 1 },
  pageSubtitle: { fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.125rem' },
  pageDate: { fontSize: '0.8125rem', color: '#9ca3af' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' },
  card: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '1.5rem', marginBottom: '1rem' },
  cardTitle: { fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.625rem', borderBottom: '1px solid #f3f4f6', color: '#111827' },
  description: { fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7 },
  aiNote: { fontSize: '0.8125rem', color: '#6b7280', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '3px', padding: '0.625rem 0.875rem', marginBottom: '0.875rem', lineHeight: 1.5 },
  aiResult: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' as const },
  aiCategory: { fontSize: '0.9375rem', color: '#111827' },
  aiConfidence: { fontSize: '0.75rem', color: '#6b7280', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '3px', padding: '0.125rem 0.5rem' },
  simRow: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.875rem', gap: '0.5rem' },
  simTitle: { color: '#374151' },
  simScore: { fontSize: '0.75rem', fontWeight: 600, color: '#92400e', flexShrink: 0 },
  mediaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' },
  mediaImg: { width: '100%', height: '120px', objectFit: 'cover', borderRadius: '3px', border: '1px solid #e5e7eb' },
  timeline: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' },
  timelineItem: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  dot: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 },
  dotDone: { background: '#166534', color: '#fff', border: '1px solid #15803d' },
  dotActive: { background: '#1d4ed8', color: '#fff', border: '1px solid #1d4ed8' },
  dotPending: { background: '#f3f4f6', color: '#9ca3af', border: '1px solid #e5e7eb' },
  feedbackCard: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '1.25rem', textAlign: 'center' as const },
  feedbackText: { fontSize: '0.875rem', color: '#166534', marginBottom: '0.875rem', lineHeight: 1.5 },
  feedbackBtn: { display: 'inline-block', padding: '0.5rem 1.25rem', background: '#15803d', color: '#fff', textDecoration: 'none', borderRadius: '3px', fontSize: '0.875rem', fontWeight: 600 },
};

export default ProblemDetail;
