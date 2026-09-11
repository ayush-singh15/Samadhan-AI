import React, { useState } from 'react';
import { mock_projects } from '../../mocks';
import type { Project } from '../../types';

// TODO: replace with real API calls:
// GET /api/v1/projects — browse all projects
// POST /api/v1/industry/fund { projectId, amountOffered } — submit funding offer

const BrowseProposals: React.FC = () => {
  const projects: Project[] = mock_projects;
  const [offered, setOffered] = useState<Set<string>>(new Set());
  const [offerAmounts, setOfferAmounts] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const handleFund = async (projectId: string) => {
    const amount = Number(offerAmounts[projectId]);
    if (!amount || amount <= 0) return;
    setSubmitting(projectId);
    try {
      // TODO: call POST /api/v1/industry/fund { projectId, amountOffered: amount }
      // This endpoint exists in the backend (industry.routes.ts) but requires auth
      await new Promise((r) => setTimeout(r, 600));
      setOffered((prev) => new Set(prev).add(projectId));
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.inner}>
          <h1 style={s.pageTitle}>Browse Projects</h1>
          <p style={s.pageSubtitle}>Support innovative university solutions with CSR funding</p>
        </div>
      </div>

      <div style={s.content}>
        <div style={s.notice}>
          <strong>⚠ Mock Data:</strong> Project listing is not yet connected to the backend. Showing demo projects.
        </div>

        {projects.length === 0
          ? <div style={s.empty}><p>No projects available for funding at this time.</p></div>
          : (
            <div style={s.list}>
              {projects.map((p) => (
                <div key={p.id} style={s.card}>
                  <div style={s.cardTop}>
                    <div style={s.cardMain}>
                      <h2 style={s.cardTitle}>{p.title}</h2>
                      {p.universityName && <p style={s.cardUniv}>{p.universityName}</p>}
                      {p.problemTitle && <p style={s.cardProblem}>Addressing: {p.problemTitle}</p>}
                      <p style={s.cardMeta}>Funded so far: ₹{(p.fundedAmount / 100000).toFixed(1)}L · {p.milestones.length} milestones</p>
                    </div>
                    <span style={s.statusBadge}>{p.status.replace(/_/g, ' ')}</span>
                  </div>

                  {offered.has(p.id) ? (
                    <div style={s.fundedNote}>
                      ✓ Funding offer submitted for ₹{(Number(offerAmounts[p.id]) / 100000).toFixed(1)}L. Pending admin approval.
                    </div>
                  ) : (
                    <div style={s.fundRow}>
                      <label htmlFor={`fund-${p.id}`} style={s.fundLabel}>Offer funding (₹):</label>
                      <input
                        id={`fund-${p.id}`}
                        type="number"
                        min="1"
                        placeholder="e.g. 500000"
                        value={offerAmounts[p.id] ?? ''}
                        onChange={(e) => setOfferAmounts((prev) => ({ ...prev, [p.id]: e.target.value }))}
                        disabled={submitting === p.id}
                        style={s.fundInput}
                      />
                      <button
                        onClick={() => handleFund(p.id)}
                        disabled={submitting === p.id || !offerAmounts[p.id] || Number(offerAmounts[p.id]) <= 0}
                        style={{ ...s.fundBtn, opacity: submitting === p.id ? 0.6 : 1, cursor: submitting === p.id ? 'not-allowed' : 'pointer' }}
                      >
                        {submitting === p.id ? 'Submitting…' : 'Submit Offer'}
                      </button>
                    </div>
                  )}
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
  pageTitle: { fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.01em' },
  pageSubtitle: { fontSize: '0.875rem', color: '#6b7280' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' },
  notice: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#92400e', marginBottom: '1.5rem', lineHeight: 1.5 },
  list: { display: 'flex', flexDirection: 'column' as const, gap: '1rem' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '1.5rem' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' as const },
  cardMain: { flex: 1 },
  cardTitle: { fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' },
  cardUniv: { fontSize: '0.875rem', color: '#1d4ed8', fontWeight: 500, marginBottom: '0.125rem' },
  cardProblem: { fontSize: '0.8125rem', color: '#374151', fontStyle: 'italic', marginBottom: '0.25rem' },
  cardMeta: { fontSize: '0.8125rem', color: '#6b7280' },
  statusBadge: { fontSize: '0.75rem', fontWeight: 600, color: '#374151', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '3px', padding: '0.2rem 0.625rem', whiteSpace: 'nowrap' as const, flexShrink: 0 },
  fundRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' as const, borderTop: '1px solid #f3f4f6', paddingTop: '1rem' },
  fundLabel: { fontSize: '0.875rem', fontWeight: 600, color: '#374151', flexShrink: 0 },
  fundInput: { flex: 1, minWidth: '160px', maxWidth: '240px', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '3px', fontSize: '0.9375rem', outline: 'none', fontFamily: 'inherit', background: '#fafaf9' },
  fundBtn: { padding: '0.5rem 1.125rem', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '0.875rem', fontWeight: 600, fontFamily: 'inherit' },
  fundedNote: { fontSize: '0.875rem', color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '3px', padding: '0.625rem 0.875rem', borderTop: '1px solid #f3f4f6', marginTop: '0' },
  empty: { textAlign: 'center' as const, padding: '3rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', color: '#6b7280' },
};

export default BrowseProposals;
