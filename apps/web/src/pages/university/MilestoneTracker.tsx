import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mock_projects } from '../../mocks';
import type { Project, Milestone } from '../../types';

// TODO: replace with real API call to GET /api/v1/projects/:id when backend is built

const MilestoneTracker: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    // Mock lookup — replace with API call
    const found = mock_projects.find((p) => p.id === projectId) ?? mock_projects[0];
    setProject(found);
    setMilestones(found?.milestones ?? []);
    setLoading(false);
  }, [projectId]);

  const handleComplete = async (msId: string) => {
    setSubmitting(msId);
    // TODO: call PATCH /api/v1/projects/:projectId/milestones/:msId { isCompleted: true }
    await new Promise((r) => setTimeout(r, 400));
    setMilestones((prev) => prev.map((m) => m.id === msId ? { ...m, isCompleted: true } : m));
    setSubmitting(null);
  };

  if (loading) return <div style={s.page}><div style={s.content}><p>Loading…</p></div></div>;
  if (!project) return <div style={s.page}><div style={s.content}><p>Project not found.</p></div></div>;

  const totalFunding = milestones.reduce((sum, m) => sum + m.fundingPercentage, 0);
  const earnedFunding = milestones.filter((m) => m.isCompleted).reduce((sum, m) => sum + m.fundingPercentage, 0);

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.inner}>
          <Link to="/university/projects" style={s.backLink}>← Projects</Link>
          <h1 style={s.pageTitle}>{project.title}</h1>
          <p style={s.pageSubtitle}>
            {milestones.filter((m) => m.isCompleted).length}/{milestones.length} milestones complete ·{' '}
            Funding earned: {earnedFunding.toFixed(0)}% / {totalFunding.toFixed(0)}%
          </p>
        </div>
      </div>

      <div style={s.content}>
        <div style={s.notice}>
          <strong>⚠ Mock Data:</strong> Milestone update endpoint is not yet available. Completions won't persist.
        </div>

        {/* Progress bar */}
        <div style={s.progressBlock}>
          <div style={s.progressLabel}>
            <span style={s.progText}>Overall Progress</span>
            <span style={s.progPct}>{milestones.length > 0 ? Math.round((milestones.filter((m) => m.isCompleted).length / milestones.length) * 100) : 0}%</span>
          </div>
          <div style={s.progressBar}>
            <div style={{ ...s.progressFill, width: `${milestones.length > 0 ? (milestones.filter((m) => m.isCompleted).length / milestones.length) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Milestone list */}
        {milestones.length === 0
          ? <div style={s.empty}><p>No milestones defined for this project.</p></div>
          : (
            <div style={s.list}>
              {milestones.map((m, i) => (
                <div key={m.id} style={{ ...s.card, opacity: m.isCompleted ? 0.75 : 1 }}>
                  <div style={s.cardTop}>
                    <div style={{ ...s.dot, ...(m.isCompleted ? s.dotDone : s.dotPending) }}>
                      {m.isCompleted ? '✓' : i + 1}
                    </div>
                    <div style={s.cardMain}>
                      <h2 style={s.cardTitle}>{m.title}</h2>
                      <p style={s.cardDesc}>{m.description}</p>
                      <p style={s.cardMeta}>
                        Due: {new Date(m.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {' · '}Funding: {m.fundingPercentage}% of total
                      </p>
                    </div>
                    <div style={s.cardRight}>
                      {m.isCompleted ? (
                        <span style={s.completedBadge}>Completed ✓</span>
                      ) : (
                        <button
                          onClick={() => handleComplete(m.id)}
                          disabled={submitting === m.id}
                          style={{ ...s.completeBtn, opacity: submitting === m.id ? 0.6 : 1 }}
                        >
                          {submitting === m.id ? '…' : 'Mark Complete'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'Inter, system-ui, sans-serif', color: '#111827', minHeight: '100%' },
  pageHeader: { background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '1.5rem' },
  inner: { maxWidth: '1100px', margin: '0 auto' },
  backLink: { display: 'inline-block', fontSize: '0.8125rem', color: '#1d4ed8', textDecoration: 'none', marginBottom: '0.75rem', fontWeight: 500 },
  pageTitle: { fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.01em' },
  pageSubtitle: { fontSize: '0.875rem', color: '#6b7280' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' },
  notice: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#92400e', marginBottom: '1.5rem', lineHeight: 1.5 },
  progressBlock: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '1.25rem', marginBottom: '1.5rem' },
  progressLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' },
  progText: { fontSize: '0.875rem', fontWeight: 600, color: '#374151' },
  progPct: { fontSize: '0.875rem', fontWeight: 700, color: '#1d4ed8' },
  progressBar: { height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#1d4ed8', borderRadius: '4px' },
  list: { display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '1.25rem' },
  cardTop: { display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' as const },
  dot: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, flexShrink: 0 },
  dotDone: { background: '#166534', color: '#fff', border: '1px solid #15803d' },
  dotPending: { background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' },
  cardMain: { flex: 1, minWidth: 0 },
  cardTitle: { fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '0.375rem' },
  cardDesc: { fontSize: '0.875rem', color: '#374151', lineHeight: 1.6, marginBottom: '0.375rem' },
  cardMeta: { fontSize: '0.8125rem', color: '#6b7280' },
  cardRight: { flexShrink: 0 },
  completedBadge: { fontSize: '0.75rem', fontWeight: 600, color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '3px', padding: '0.2rem 0.625rem', whiteSpace: 'nowrap' as const, display: 'inline-block' },
  completeBtn: { padding: '0.375rem 0.875rem', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' as const },
  empty: { textAlign: 'center' as const, padding: '3rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', color: '#6b7280' },
};

export default MilestoneTracker;
