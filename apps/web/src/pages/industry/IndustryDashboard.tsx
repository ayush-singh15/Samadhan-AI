import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mock_projects } from '../../mocks';
import type { Project } from '../../types';

// TODO: replace mock data with real API calls when these endpoints are built:
// GET /api/v1/industry/partners — gets industry profile
// GET /api/v1/projects — list all projects available for funding

const IndustryDashboard: React.FC = () => {
  const { user } = useAuth();
  const projects: Project[] = mock_projects;

  const totalFunded = projects.reduce((sum, p) => sum + p.fundedAmount, 0);
  const activeProjects = projects.filter((p) => p.status === 'IN_DEVELOPMENT').length;

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.inner}>
          <h1 style={s.pageTitle}>Industry / CSR Dashboard</h1>
          <p style={s.pageSubtitle}>Welcome, <strong>{user?.name}</strong></p>
        </div>
      </div>

      <div style={s.content}>
        <div style={s.notice}>
          <strong>⚠ Mock Data:</strong> Industry partner and project funding endpoints are not yet active. Showing demo data.
        </div>

        {/* Stats */}
        <div style={s.statsGrid}>
          {[
            { label: 'Projects Funded',   value: projects.length },
            { label: 'Active Projects',   value: activeProjects },
            { label: 'Total Funded (₹L)', value: (totalFunded / 100000).toFixed(1) },
          ].map(({ label, value }) => (
            <div key={label} style={s.statCard}>
              <span style={s.statValue}>{value}</span>
              <span style={s.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={s.ctaBanner}>
          <div>
            <p style={s.ctaTitle}>Support high-impact projects</p>
            <p style={s.ctaDesc}>Browse approved university proposals and provide CSR funding to projects that align with your focus areas.</p>
          </div>
          <Link to="/industry/proposals" style={s.ctaBtn}>Browse Projects</Link>
        </div>

        {/* Recent funded projects */}
        <section aria-labelledby="funded-heading">
          <h2 id="funded-heading" style={s.sectionTitle}>Funded Projects</h2>
          {projects.length === 0
            ? <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No funded projects yet.</p>
            : (
              <div style={s.list}>
                {projects.map((p) => (
                  <div key={p.id} style={s.row}>
                    <div style={s.rowMain}>
                      <p style={s.rowTitle}>{p.title}</p>
                      <p style={s.rowMeta}>{p.universityName} · Status: {p.status.replace(/_/g, ' ')} · Funded: ₹{(p.fundedAmount / 100000).toFixed(1)}L</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                      <div style={s.milePct}>
                        {p.milestones.length > 0
                          ? `${Math.round((p.milestones.filter((m) => m.isCompleted).length / p.milestones.length) * 100)}% done`
                          : 'No milestones'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </section>
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
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  statCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' as const, gap: '0.25rem' },
  statValue: { fontSize: '1.75rem', fontWeight: 700, color: '#111827', lineHeight: 1 },
  statLabel: { fontSize: '0.8125rem', color: '#6b7280' },
  ctaBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' as const },
  ctaTitle: { fontWeight: 700, fontSize: '1rem', color: '#1e40af', marginBottom: '0.25rem' },
  ctaDesc: { fontSize: '0.875rem', color: '#1d4ed8', lineHeight: 1.5 },
  ctaBtn: { display: 'inline-block', padding: '0.625rem 1.25rem', background: '#1d4ed8', color: '#fff', textDecoration: 'none', borderRadius: '3px', fontSize: '0.875rem', fontWeight: 600, flexShrink: 0 },
  sectionTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' },
  list: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden' },
  row: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6', flexWrap: 'wrap' as const },
  rowMain: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: '0.9375rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' },
  rowMeta: { fontSize: '0.8125rem', color: '#6b7280' },
  milePct: { fontSize: '0.875rem', fontWeight: 600, color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '3px', padding: '0.2rem 0.625rem', whiteSpace: 'nowrap' as const },
};

export default IndustryDashboard;
