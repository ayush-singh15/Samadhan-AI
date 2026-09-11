import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { problemsApi } from '../../api/problems.api';
import type { Problem } from '../../types';

const CATEGORY_FILTERS = ['All', 'Drainage & Water', 'Road Infrastructure', 'Public Safety & Energy', 'Healthcare'];
const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: 'bg-surface-container text-on-surface-variant',
  AI_CATEGORIZED: 'bg-secondary-container text-on-secondary-container',
  ASSIGNED_TO_UNIVERSITY: 'bg-primary-fixed/60 text-primary',
  PROPOSAL_SUBMITTED: 'bg-secondary-fixed text-on-secondary-fixed',
  FUNDING_APPROVED: 'bg-tertiary-fixed text-tertiary',
  IN_PROGRESS: 'bg-surface-container-high text-primary',
  RESOLVED: 'bg-primary-container/20 text-primary-container',
  REJECTED: 'bg-error-container text-on-error-container',
};

function pct(p: Problem) {
  const order = ['SUBMITTED','AI_CATEGORIZED','ASSIGNED_TO_UNIVERSITY','PROPOSAL_SUBMITTED','FUNDING_APPROVED','IN_PROGRESS','RESOLVED'];
  const i = order.indexOf(p.status);
  return i < 0 ? 0 : Math.round(((i + 1) / order.length) * 100);
}

const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All Active & Archived');

  useEffect(() => {
    problemsApi.getAll()
      .then(setProblems)
      .catch(() => setProblems([]))
      .finally(() => setLoading(false));
  }, []);

  const submitted = problems.filter(p => p.status === 'SUBMITTED').length;
  const underReview = problems.filter(p => ['AI_CATEGORIZED','ASSIGNED_TO_UNIVERSITY'].includes(p.status)).length;
  const inProgress = problems.filter(p => ['IN_PROGRESS','PROPOSAL_SUBMITTED','FUNDING_APPROVED'].includes(p.status)).length;
  const resolved = problems.filter(p => p.status === 'RESOLVED').length;

  return (
    <div className="flex flex-col w-full gap-space-xl">

      {/* ─── Welcome Command Horizon ────────────────────────────────────── */}
      <div className="relative bg-surface-container-lowest rounded-xl p-space-lg shadow-xs overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-secondary-container/40 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Civic Ward Terminal • Verified Citizen Hub
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              Welcome back, {user?.name ?? 'Citizen'}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
              Ward 42, Indiranagar • BBMP Zone: East-IND42
            </p>
          </div>
          <Link
            to="/citizen/problems/submit"
            className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm shadow-md hover:bg-primary-container transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <span className="material-symbols-outlined">add_circle</span>
            + Report New Community Problem
          </Link>
        </div>

        {/* Stats band */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mt-space-xl pt-space-lg border-t border-outline-variant/20">
          {[
            { value: problems.length, label: 'Problems Reported', icon: 'campaign', color: 'text-on-surface', bg: 'bg-surface-container-high' },
            { value: underReview,     label: 'Under Review',       icon: 'hourglass_top', color: 'text-tertiary', bg: 'bg-tertiary-fixed/40' },
            { value: inProgress,      label: 'In Progress',        icon: 'biotech',       color: 'text-primary', bg: 'bg-primary-fixed/50' },
            { value: resolved,        label: 'Resolved & Verified', icon: 'verified_user', color: 'text-primary-container', bg: 'bg-surface-container-highest' },
          ].map(({ value, label, icon, color, bg }) => (
            <div key={label} className="bg-surface-container-low/70 rounded-xl p-space-md flex items-center justify-between">
              <div className="flex flex-col">
                <span className={`font-headline-lg text-headline-lg font-bold leading-tight ${color}`}>{loading ? '—' : value}</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-1">{label}</span>
              </div>
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center ${color}`}>
                <span className="material-symbols-outlined">{icon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Main Split: Problems (8 col) + Ward Sidebar (4 col) ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">

        {/* ─── Left: Problem Feed ──────────────────────────────────────── */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">

          {/* Filter bar */}
          <div className="bg-surface-container-lowest rounded-xl p-space-base shadow-xs flex flex-col md:flex-row gap-space-md items-center justify-between">
            <div className="flex items-center gap-space-xs overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {CATEGORY_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-space-md py-1.5 rounded-full font-label-md text-label-md transition-colors whitespace-nowrap ${
                    activeFilter === f
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {f}{f === 'All' && ` (${problems.length})`}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-space-xs shrink-0">
              <span className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap">STATUS FILTER:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-surface-container-low text-on-surface font-label-md text-label-md rounded-lg px-3 py-1.5 border border-outline-variant/40 focus:outline-none"
              >
                <option>All Active & Archived</option>
                <option>Active</option>
                <option>Resolved</option>
                <option>Under Review</option>
              </select>
            </div>
          </div>

          {/* Problem cards */}
          {loading ? (
            <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center">
              <span className="material-symbols-outlined text-4xl text-outline-variant block mb-2 animate-pulse">hourglass_top</span>
              <p className="font-body-md text-body-md text-on-surface-variant">Loading your civic reports…</p>
            </div>
          ) : problems.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center">
              <span className="material-symbols-outlined text-5xl text-outline-variant block mb-3">campaign</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">No problems reported yet</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">Be the first to report a local issue in your ward.</p>
              <Link to="/citizen/problems/submit" className="inline-flex items-center gap-1.5 px-space-md py-2 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Report a Problem
              </Link>
            </div>
          ) : (
            problems.map((p) => (
              <div key={p.id} className="bg-surface-container-lowest rounded-xl shadow-xs hover:shadow-md transition-shadow overflow-hidden">
                {/* Card header */}
                <div className="px-space-lg pt-space-lg pb-space-md border-b border-outline-variant/20">
                  <div className="flex flex-wrap items-center gap-space-xs mb-space-sm">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed/30 text-primary font-label-md text-label-md font-semibold">
                      {p.category.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md">
                      Token #{p.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="ml-auto font-body-sm text-body-sm text-on-surface-variant">
                      Submitted: {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {p.status === 'SUBMITTED' || p.status === 'AI_CATEGORIZED' ? (
                    <span className="inline-flex items-center gap-1 font-label-md text-label-md text-error mb-space-xs">
                      <span className="material-symbols-outlined text-[16px]">priority_high</span>
                      High Priority
                    </span>
                  ) : null}

                  <h2 className="font-headline-md text-headline-md text-on-surface mb-space-xs">{p.title}</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[16px]">location_on</span>
                    {p.address}, {p.district}, {p.state}
                  </p>
                </div>

                {/* Assigned university (if any) */}
                {p.assignedUniversityId && (
                  <div className="mx-space-lg my-space-md p-space-sm rounded-lg bg-surface-container border border-outline-variant/30 flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">school</span>
                    <div className="flex-1">
                      <p className="font-label-caps text-label-caps text-primary uppercase text-[10px]">Assigned R&D Consortium</p>
                      <p className="font-label-lg text-label-lg text-on-surface">University Research Team</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary-container font-label-caps text-label-caps text-[10px] uppercase">MOU Executed</span>
                  </div>
                )}

                {/* Milestone progress */}
                <div className="px-space-lg py-space-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">
                      Pipeline Progress
                    </span>
                    <span className="font-label-md text-label-md text-primary font-semibold">{pct(p)}% Active</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-1.5 mb-space-sm">
                    <div className="bg-primary h-1.5 rounded-full progress-bar" style={{ width: `${pct(p)}%` }} />
                  </div>
                  <div className="flex gap-space-xs overflow-x-auto text-[10px] font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                    {['SUBMITTED','CATEGORIZED','ASSIGNED','PROPOSAL','FUNDED','IN PROGRESS','RESOLVED'].map((step, i) => (
                      <span key={step} className={`whitespace-nowrap ${i < Math.floor(pct(p)/14.3) ? 'text-primary font-semibold' : ''}`}>
                        {i > 0 && <span className="mr-space-xs text-outline-variant">•</span>}
                        {step}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Media thumbnails */}
                {p.mediaUrls && p.mediaUrls.length > 0 && (
                  <div className="px-space-lg pb-space-md flex gap-space-xs">
                    {p.mediaUrls.slice(0, 3).map((url, i) => (
                      <div key={i} className="w-20 h-14 rounded-lg bg-surface-container-high overflow-hidden">
                        <img src={url} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="px-space-lg pb-space-lg flex flex-wrap gap-space-sm">
                  <Link to={`/citizen/problems/${p.id}`} className="px-space-md py-1.5 rounded-lg bg-surface-container text-on-surface font-label-lg text-label-lg flex items-center gap-1.5 hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-[16px]">photo_library</span>
                    View Site Photos
                  </Link>
                  {p.status === 'RESOLVED' && (
                    <Link to={`/citizen/feedback/${p.id}`} className="px-space-md py-1.5 rounded-lg border border-primary text-primary font-label-lg text-label-lg flex items-center gap-1.5 hover:bg-primary/5 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">feedback</span>
                      Provide Citizen Feedback
                    </Link>
                  )}
                  <Link to={`/citizen/problems/${p.id}`} className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-1.5 hover:bg-primary-container transition-colors">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    Track Full Milestones
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ─── Right: Ward Pulse Sidebar ─────────────────────────────────── */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">

          {/* Ward Pulse Mesh */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs">
            <div className="flex items-center justify-between mb-space-sm">
              <div>
                <p className="font-label-caps text-label-caps text-primary uppercase tracking-wider text-[10px]">Ward Pulse Mesh</p>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Indiranagar Ward 42</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps text-[10px]">87 active nodes</span>
            </div>
            {/* Map placeholder */}
            <div className="bg-surface-container-low rounded-xl h-32 flex items-center justify-center mb-space-md overflow-hidden relative">
              <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-primary/20 to-primary-fixed/40" />
              <span className="material-symbols-outlined text-4xl text-primary/40">map</span>
            </div>
            <div className="grid grid-cols-2 gap-space-sm">
              <div className="bg-surface-container-low rounded-lg p-space-sm">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">Avg Resolution</p>
                <p className="font-headline-sm text-headline-sm text-on-surface font-bold">18 Days</p>
              </div>
              <div className="bg-surface-container-low rounded-lg p-space-sm">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">Citizen Upvotes</p>
                <p className="font-headline-sm text-headline-sm text-on-surface font-bold">1,420</p>
              </div>
            </div>
          </div>

          {/* Ward Live Stream */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs">
            <div className="flex items-center justify-between mb-space-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Ward 42 Live Stream</h3>
              <button className="font-label-md text-label-md text-primary hover:underline">NEARBY</button>
            </div>
            {[
              { cat: 'Waste Segregation', time: '12m ago', title: 'Illegal dumping buffer identified near Defense Colony Park', by: 'Reported by Priya M.', status: 'Under Inspection', upvotes: 42 },
              { cat: 'Water Supply', time: '1h ago', title: 'Cauvery water contamination test kit distributed for 4th Main block', by: 'BWSSB Water Quality Cell', status: 'Solved', upvotes: 89 },
              { cat: 'Traffic & Air Quality', time: '3h ago', title: 'Micro-sensor Air Quality Index hit 184 PM2.5 at 100ft Road cross', by: 'Civic Alert dispatched', status: 'Monitoring', upvotes: 116 },
            ].map((item, i) => (
              <div key={i} className={`py-space-sm ${i < 2 ? 'border-b border-outline-variant/20' : ''}`}>
                <div className="flex items-center justify-between mb-space-2xs">
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider text-[10px]">{item.cat}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">{item.time}</span>
                </div>
                <p className="font-label-lg text-label-lg text-on-surface mb-space-2xs">{item.title}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mb-space-xs">{item.by}</p>
                <div className="flex items-center gap-space-sm">
                  <button className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                    {item.upvotes} Upvotes
                  </button>
                  <span className={`px-2 py-0.5 rounded-full font-label-caps text-label-caps text-[10px] ${
                    item.status === 'Solved' ? 'bg-primary/10 text-primary' :
                    item.status === 'Monitoring' ? 'bg-tertiary-fixed text-tertiary' :
                    'bg-surface-container text-on-surface-variant'
                  }`}>{item.status}</span>
                </div>
              </div>
            ))}
            <Link to="/citizen/problems" className="block mt-space-md font-label-lg text-label-lg text-primary hover:underline flex items-center gap-1">
              Explore Ward 42 Citizen Ledger
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Trust protocol */}
          <div className="bg-inverse-surface rounded-xl p-space-md">
            <p className="font-label-caps text-label-caps text-inverse-primary uppercase tracking-wider text-[10px] mb-space-xs">Institutional Trust Protocol</p>
            <h4 className="font-headline-sm text-headline-sm text-inverse-on-surface mb-space-xs">TriSetu Cryptographic Ledger</h4>
            <p className="font-body-sm text-body-sm text-inverse-on-surface/70">Every submission is stamped onto the Karnataka State Civic Data Mesh with hash provenance and academic peer-review verification.</p>
            <p className="font-code text-code text-inverse-primary/80 mt-space-sm text-[11px]">SHA-256 Node: BBMP-IND42-2024-ZK9</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
