import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mock_projects } from '../../mocks';
import type { Project } from '../../types';

// TODO: replace with real API call to GET /api/v1/projects when endpoint is built

const ProjectList: React.FC = () => {
  const projects: Project[] = mock_projects;

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.inner}>
          <h1 style={s.pageTitle}>Projects</h1>
          <p style={s.pageSubtitle}>{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div style={s.content}>
        <div style={s.notice}>
          <strong>⚠ Mock Data:</strong> Project list endpoint is not yet available in the backend. Showing demo data.
        </div>

        {projects.length === 0
          ? <div style={s.empty}><p>No projects yet.</p></div>
          : (
            <div style={s.list}>
              {projects.map((p) => {
                const done = p.milestones.filter((m) => m.isCompleted).length;
                const total = p.milestones.length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={p.id} style={s.card}>
                    <div style={s.cardTop}>
                      <div style={s.cardMain}>
                        <h2 style={s.cardTitle}>{p.title}</h2>
                        {p.problemTitle && <p style={s.cardSub}>Problem: {p.problemTitle}</p>}
                        <p style={s.cardMeta}>Status: {p.status.replace(/_/g, ' ')} · Funded: ₹{(p.fundedAmount / 100000).toFixed(1)}L</p>
                      </div>
                    </div>
                    <div style={s.progressRow}>
                      <div style={s.progressBar}>
                        <div style={{ ...s.progressFill, width: `${pct}%` }} />
                      </div>
                      <span style={s.progressText}>{done}/{total} milestones</span>
                    </div>
                    <Link to={`/university/projects/${p.id}/milestones`} style={s.cta}>View Milestones</Link>
                  </div>
                );
              })}
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
  cardTop: { display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' as const },
  cardMain: { flex: 1 },
  cardTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem', color: '#111827' },
  cardSub: { fontSize: '0.8125rem', color: '#374151', marginBottom: '0.125rem' },
  cardMeta: { fontSize: '0.8125rem', color: '#6b7280' },
  progressRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' },
  progressBar: { flex: 1, height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#1d4ed8', borderRadius: '3px' },
  progressText: { fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'nowrap' as const },
  cta: { display: 'inline-block', padding: '0.5rem 1rem', background: '#1d4ed8', color: '#fff', textDecoration: 'none', borderRadius: '3px', fontSize: '0.875rem', fontWeight: 600 },
  empty: { textAlign: 'center' as const, padding: '3rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', color: '#6b7280' },
};

export default ProjectList;
