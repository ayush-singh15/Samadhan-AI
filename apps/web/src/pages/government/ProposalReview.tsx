import React, { useState } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import { mock_proposals } from '../../mocks';
import type { Proposal } from '../../types';

// TODO: replace with real API call to GET /api/v1/proposals when that endpoint is built

const ProposalReview: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>(mock_proposals);
  const [selected, setSelected] = useState<Proposal | null>(null);

  const handleApprove = (id: string) => {
    // TODO: call PATCH /api/v1/proposals/:id { status: 'APPROVED' }
    setProposals((prev) => prev.map((p) => p.id === id ? { ...p, status: 'APPROVED' } : p));
    setSelected(null);
  };

  const handleReject = (id: string) => {
    // TODO: call PATCH /api/v1/proposals/:id { status: 'REJECTED' }
    setProposals((prev) => prev.map((p) => p.id === id ? { ...p, status: 'REJECTED' } : p));
    setSelected(null);
  };

  const pending = proposals.filter((p) => p.status === 'SUBMITTED');

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.inner}>
          <h1 style={s.pageTitle}>Proposal Review</h1>
          <p style={s.pageSubtitle}>{pending.length} proposal{pending.length !== 1 ? 's' : ''} awaiting review</p>
        </div>
      </div>

      <div style={s.content}>
        <div style={s.notice}>
          <strong>⚠ Mock Data:</strong> Proposal list endpoint is not yet available in the backend. Showing demo proposals.
        </div>

        {proposals.length === 0
          ? <div style={s.empty}><p>No proposals to review.</p></div>
          : (
            <div style={s.list}>
              {proposals.map((p) => (
                <div key={p.id} style={s.row}>
                  <div style={s.rowMain}>
                    <p style={s.rowTitle}>{p.title}</p>
                    <p style={s.rowSub}>{p.universityName} · For: <em>{p.problemTitle}</em></p>
                    <p style={s.rowMeta}>Budget: ₹{(p.budgetRequired / 100000).toFixed(1)}L · {p.timelineMonths} months</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <StatusBadge status={p.status} />
                    {p.status === 'SUBMITTED' && (
                      <button onClick={() => setSelected(p)} style={s.reviewBtn}>Review</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>

      {selected && (
        <>
          <div style={s.overlay} onClick={() => setSelected(null)} aria-hidden="true" />
          <div style={s.panel} role="dialog" aria-labelledby="prop-title" aria-modal="true">
            <div style={s.panelHeader}>
              <h2 id="prop-title" style={s.panelTitle}>Proposal Details</h2>
              <button onClick={() => setSelected(null)} style={s.closeBtn} aria-label="Close">✕</button>
            </div>
            <div style={s.panelBody}>
              <h3 style={s.h3}>{selected.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#1d4ed8', fontWeight: 500, marginBottom: '0.25rem' }}>{selected.universityName}</p>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '1.25rem' }}>Problem: {selected.problemTitle}</p>

              {[
                { label: 'Abstract', value: selected.abstract },
                { label: 'Budget Required', value: `₹${(selected.budgetRequired / 100000).toFixed(1)} lakhs` },
                { label: 'Timeline', value: `${selected.timelineMonths} months` },
              ].map(({ label, value }) => (
                <div key={label} style={s.detailSection}>
                  <p style={s.detailLabel}>{label}</p>
                  <p style={s.detailValue}>{value}</p>
                </div>
              ))}

              <div style={s.panelActions}>
                <button onClick={() => handleApprove(selected.id)} style={s.approveBtn}>Approve Proposal</button>
                <button onClick={() => handleReject(selected.id)} style={s.rejectBtn}>Reject</button>
              </div>
            </div>
          </div>
        </>
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
  notice: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#92400e', marginBottom: '1.5rem', lineHeight: 1.5 },
  empty: { textAlign: 'center' as const, padding: '3rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', color: '#6b7280' },
  list: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden' },
  row: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6', flexWrap: 'wrap' as const },
  rowMain: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: '0.9375rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' },
  rowSub: { fontSize: '0.8125rem', color: '#374151', marginBottom: '0.125rem' },
  rowMeta: { fontSize: '0.8125rem', color: '#6b7280' },
  reviewBtn: { padding: '0.375rem 0.875rem', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200 },
  panel: { position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '540px', background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.08)', zIndex: 201, display: 'flex', flexDirection: 'column' as const },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb' },
  panelTitle: { fontSize: '1rem', fontWeight: 700, margin: 0 },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#6b7280', lineHeight: 1 },
  panelBody: { flex: 1, overflowY: 'auto' as const, padding: '1.5rem' },
  h3: { fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.375rem', color: '#111827' },
  detailSection: { marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' },
  detailLabel: { fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.04em', marginBottom: '0.375rem' },
  detailValue: { fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6 },
  panelActions: { display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', marginTop: '0.5rem' },
  approveBtn: { flex: 1, padding: '0.7rem', background: '#15803d', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  rejectBtn: { padding: '0.7rem 1.25rem', background: 'transparent', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '3px', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
};

export default ProposalReview;
