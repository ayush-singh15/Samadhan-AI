import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { problemsApi } from '../../api/problems.api';
import StatusBadge from '../../components/ui/StatusBadge';
import { LoadingState, ErrorState } from '../../components/ui/States';
import type { Problem } from '../../types';

const ProblemDiscovery: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Shows all ASSIGNED_TO_UNIVERSITY problems (visible to university role)
    // TODO: When backend adds university-scoped endpoint, use /api/v1/universities/:id/problems
    problemsApi.getAll()
      .then((all) => setProblems(all.filter((p) => p.status === 'ASSIGNED_TO_UNIVERSITY')))
      .catch(() => setError('Unable to load problems.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.inner}>
          <h1 style={s.pageTitle}>Assigned Problems</h1>
          <p style={s.pageSubtitle}>Problems assigned to your institution — submit a solution proposal</p>
        </div>
      </div>

      <div style={s.content}>
        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}
        {!loading && !error && problems.length === 0 && (
          <div style={s.empty}><p>No problems currently assigned to your institution.</p></div>
        )}
        {!loading && !error && problems.map((p) => (
          <div key={p.id} style={s.card}>
            <div style={s.cardTop}>
              <div style={s.cardMain}>
                <p style={s.category}>{p.category.replace(/_/g, ' ')}</p>
                <h2 style={s.cardTitle}>{p.title}</h2>
                <p style={s.location}>📍 {p.address}, {p.district}, {p.state}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <p style={s.desc}>
              {p.description.length > 250 ? p.description.slice(0, 250) + '…' : p.description}
            </p>
            {p.aiCategory && (
              <p style={s.aiTag}>AI Category: {p.aiCategory}</p>
            )}
            <Link to={`/university/proposals/new/${p.id}`} style={s.cta}>
              Submit Solution Proposal →
            </Link>
          </div>
        ))}
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
  content: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' as const, gap: '1rem' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '1.5rem' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' as const },
  cardMain: { flex: 1 },
  category: { fontSize: '0.75rem', fontWeight: 600, color: '#1d4ed8', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.25rem' },
  cardTitle: { fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' },
  location: { fontSize: '0.8125rem', color: '#6b7280' },
  desc: { fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, marginBottom: '0.875rem' },
  aiTag: { display: 'inline-block', fontSize: '0.75rem', color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '3px', padding: '0.2rem 0.625rem', marginBottom: '1rem' },
  cta: { display: 'inline-block', padding: '0.5rem 1.125rem', background: '#1d4ed8', color: '#fff', textDecoration: 'none', borderRadius: '3px', fontSize: '0.875rem', fontWeight: 600 },
  empty: { textAlign: 'center' as const, padding: '3rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', color: '#6b7280' },
};

export default ProblemDiscovery;
