import React, { useEffect, useState } from 'react';
import { problemsApi } from '../../api/problems.api';
import StatusBadge from '../../components/ui/StatusBadge';
import { LoadingState } from '../../components/ui/States';
import type { Problem } from '../../types';

const ReviewPanel: React.FC<{
  problem: Problem;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ problem, onClose, onApprove, onReject }) => (
  <>
    <div style={s.overlay} onClick={onClose} aria-hidden="true" />
    <div style={s.panel} role="dialog" aria-labelledby="panel-title" aria-modal="true">
      <div style={s.panelHeader}>
        <h2 id="panel-title" style={s.panelTitle}>Review Problem</h2>
        <button onClick={onClose} style={s.closeBtn} aria-label="Close">✕</button>
      </div>
      <div style={s.panelBody}>
        <h3 style={s.h3}>{problem.title}</h3>
        <dl style={s.dl}>
          <dt style={s.dt}>Category</dt><dd style={s.dd}>{problem.category.replace(/_/g, ' ')}</dd>
          <dt style={s.dt}>Location</dt><dd style={s.dd}>{problem.address}, {problem.district}, {problem.state}</dd>
          <dt style={s.dt}>Submitted</dt><dd style={s.dd}>{new Date(problem.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
        </dl>
        <p style={s.desc}>{problem.description}</p>

        {problem.aiCategory && (
          <div style={s.aiBox}>
            <p style={s.aiHeading}>AI Suggested Category</p>
            <p style={s.aiNote}>This is an automated suggestion — it is not authoritative. Use your judgement.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <strong>{problem.aiCategory}</strong>
              {problem.aiConfidence && (
                <span style={s.confidence}>{Math.round(problem.aiConfidence * 100)}% confidence</span>
              )}
            </div>
          </div>
        )}

        {problem.similarProblems && problem.similarProblems.length > 0 && (
          <div style={s.simBox}>
            <p style={s.aiHeading}>Possible Similar Problems</p>
            <p style={s.aiNote}>Review these before approving to avoid duplicates.</p>
            {problem.similarProblems.map((sp) => (
              <div key={sp.problemId} style={s.simRow}>
                <span>{sp.title}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e' }}>{Math.round(sp.similarity * 100)}% similar</span>
              </div>
            ))}
          </div>
        )}

        <div style={s.panelActions}>
          <button onClick={() => onApprove(problem.id)} style={s.approveBtn}>Approve</button>
          <button onClick={() => onReject(problem.id)} style={s.rejectBtn}>Reject</button>
        </div>
      </div>
    </div>
  </>
);

const ProblemReview: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Problem | null>(null);

  useEffect(() => {
    problemsApi.getAll()
      .then((all) => setProblems(all.filter((p) => ['SUBMITTED', 'AI_CATEGORIZED'].includes(p.status))))
      .catch(() => setProblems([]))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = (id: string) => {
    // TODO: call PATCH /api/v1/problems/:id/status { status: 'ASSIGNED_TO_UNIVERSITY' }
    // This endpoint is not yet implemented in the backend.
    setProblems((prev) => prev.filter((p) => p.id !== id));
    setSelected(null);
  };

  const handleReject = (id: string) => {
    // TODO: call PATCH /api/v1/problems/:id/status { status: 'REJECTED' }
    setProblems((prev) => prev.filter((p) => p.id !== id));
    setSelected(null);
  };

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.inner}>
          <h1 style={s.pageTitle}>Problem Review</h1>
          <p style={s.pageSubtitle}>{loading ? '…' : `${problems.length} problem${problems.length !== 1 ? 's' : ''} awaiting review`}</p>
        </div>
      </div>

      <div style={s.content}>
        {loading && <LoadingState />}
        {!loading && problems.length === 0 && (
          <div style={s.empty}><p>No problems pending review. All caught up.</p></div>
        )}
        {!loading && problems.length > 0 && (
          <div style={s.list}>
            {problems.map((p) => (
              <div key={p.id} style={s.row}>
                <div style={s.rowMain}>
                  <p style={s.rowTitle}>{p.title}</p>
                  <p style={s.rowMeta}>{p.category.replace(/_/g, ' ')} · {p.district}, {p.state} · {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  {p.aiCategory && <span style={s.aiTag}>AI: {p.aiCategory}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  <StatusBadge status={p.status} />
                  <button onClick={() => setSelected(p)} style={s.reviewBtn}>Review</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <ReviewPanel
          problem={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
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
  list: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden' },
  row: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6', flexWrap: 'wrap' as const },
  rowMain: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: '0.9375rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' },
  rowMeta: { fontSize: '0.8125rem', color: '#6b7280', marginBottom: '0.25rem' },
  aiTag: { display: 'inline-block', fontSize: '0.75rem', color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '3px', padding: '0.1rem 0.5rem' },
  reviewBtn: { padding: '0.375rem 0.875rem', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  empty: { textAlign: 'center' as const, padding: '3rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', color: '#6b7280' },
  // Panel
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200 },
  panel: { position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '520px', background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.08)', zIndex: 201, display: 'flex', flexDirection: 'column' as const, fontFamily: 'Inter, system-ui, sans-serif' },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb' },
  panelTitle: { fontSize: '1rem', fontWeight: 700, margin: 0 },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#6b7280', padding: '0.25rem', lineHeight: 1 },
  panelBody: { flex: 1, overflowY: 'auto' as const, padding: '1.5rem' },
  h3: { fontSize: '1.0625rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' },
  dl: { marginBottom: '1rem' },
  dt: { fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.04em', marginBottom: '0.125rem', marginTop: '0.5rem' },
  dd: { fontSize: '0.9375rem', color: '#374151', margin: 0 },
  desc: { fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, marginBottom: '1.5rem' },
  aiBox: { background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '3px solid #d97706', borderRadius: '4px', padding: '1rem', marginBottom: '1rem' },
  simBox: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '1rem', marginBottom: '1.5rem' },
  aiHeading: { fontSize: '0.8125rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase' as const, letterSpacing: '0.04em', marginBottom: '0.375rem' },
  aiNote: { fontSize: '0.8125rem', color: '#6b7280', marginBottom: '0.75rem', lineHeight: 1.5 },
  confidence: { fontSize: '0.75rem', color: '#6b7280', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '3px', padding: '0.125rem 0.5rem' },
  simRow: { display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.875rem' },
  panelActions: { display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', marginTop: '0.5rem' },
  approveBtn: { flex: 1, padding: '0.7rem', background: '#15803d', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  rejectBtn: { padding: '0.7rem 1.25rem', background: 'transparent', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '3px', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
};

export default ProblemReview;
