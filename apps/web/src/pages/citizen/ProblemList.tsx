import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { problemsApi } from '../../api/problems.api';
import StatusBadge from '../../components/ui/StatusBadge';
import { LoadingState, ErrorState } from '../../components/ui/States';
import type { Problem, ProblemStatus } from '../../types';

const STATUS_FILTERS: { label: string; value: ProblemStatus | 'ALL' }[] = [
  { label: 'All',         value: 'ALL' },
  { label: 'Submitted',   value: 'SUBMITTED' },
  { label: 'Assigned',    value: 'ASSIGNED_TO_UNIVERSITY' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Resolved',    value: 'RESOLVED' },
  { label: 'Rejected',    value: 'REJECTED' },
];

const ProblemList: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProblemStatus | 'ALL'>('ALL');

  useEffect(() => {
    // TODO: add ?submittedById=user.id filter when backend supports it
    problemsApi.getAll()
      .then(setProblems)
      .catch(() => setError('Unable to load problems.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = problems.filter((p) => {
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchQuery = !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.district.toLowerCase().includes(query.toLowerCase());
    return matchStatus && matchQuery;
  });

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.inner}>
          <div style={s.headerRow}>
            <div>
              <h1 style={s.pageTitle}>My Problems</h1>
              <p style={s.pageSubtitle}>{loading ? '…' : `${problems.length} total`}</p>
            </div>
            <Link to="/citizen/problems/submit" style={s.addBtn}>+ Report Problem</Link>
          </div>
        </div>
      </div>

      <div style={s.content}>
        {/* Filters */}
        <div style={s.filters}>
          <input
            type="search"
            placeholder="Search by title or district…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={s.search}
            aria-label="Search problems"
          />
          <div style={s.tabs} role="group" aria-label="Filter by status">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                style={{
                  ...s.tab,
                  borderColor: statusFilter === f.value ? '#1d4ed8' : 'transparent',
                  color: statusFilter === f.value ? '#1d4ed8' : '#374151',
                  fontWeight: statusFilter === f.value ? 700 : 400,
                }}
                aria-pressed={statusFilter === f.value}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}

        {!loading && !error && filtered.length === 0 && (
          <div style={s.empty}>
            {problems.length === 0
              ? <><p>You have not submitted any problems yet.</p><Link to="/citizen/problems/submit" style={s.emptyLink}>Submit your first problem →</Link></>
              : <p>No problems match your filter.</p>
            }
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div style={s.list}>
            {filtered.map((p) => (
              <Link key={p.id} to={`/citizen/problems/${p.id}`} style={s.row}>
                <div style={s.rowMain}>
                  <p style={s.rowTitle}>{p.title}</p>
                  <p style={s.rowMeta}>
                    {p.category.replace('_', ' ')} · {p.district}, {p.state} ·{' '}
                    {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div style={s.rowRight}>
                  <StatusBadge status={p.status} />
                  <span style={s.arrow}>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'Inter, system-ui, sans-serif', color: '#111827', minHeight: '100%' },
  pageHeader: { background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '1.5rem' },
  inner: { maxWidth: '1100px', margin: '0 auto' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' as const },
  pageTitle: { fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.01em' },
  pageSubtitle: { fontSize: '0.875rem', color: '#6b7280' },
  addBtn: { display: 'inline-block', padding: '0.5rem 1rem', background: '#1d4ed8', color: '#fff', textDecoration: 'none', borderRadius: '3px', fontSize: '0.875rem', fontWeight: 600, flexShrink: 0 },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' },
  filters: { display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '1.5rem' },
  search: { padding: '0.625rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '3px', fontSize: '0.9375rem', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const, background: '#fafaf9' },
  tabs: { display: 'flex', gap: '0.25rem', flexWrap: 'wrap' as const },
  tab: { padding: '0.25rem 0.75rem', background: 'none', border: '1.5px solid', borderRadius: '3px', fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'inherit' },
  list: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden' },
  row: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6', textDecoration: 'none', color: 'inherit', flexWrap: 'wrap' as const },
  rowMain: { flex: 1, minWidth: 0 },
  rowTitle: { fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.25rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
  rowMeta: { fontSize: '0.8125rem', color: '#6b7280' },
  rowRight: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 },
  arrow: { color: '#9ca3af', fontSize: '1.125rem' },
  empty: { padding: '2rem', textAlign: 'center' as const, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', color: '#6b7280' },
  emptyLink: { color: '#1d4ed8', textDecoration: 'none', fontWeight: 500 },
};

export default ProblemList;
