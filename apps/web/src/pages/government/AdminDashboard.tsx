import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { problemsApi, type UniversityMatch } from '../../api/problems.api';
import type { Problem } from '../../types';

type View = 'queue' | 'studio';

const AdminDashboard: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('queue');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [matches, setMatches] = useState<UniversityMatch[]>([]);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'MODERATE' | 'STANDARD'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const loadProblems = async () => {
    try {
      const all = await problemsApi.getAll();
      setProblems(all);
      if (all.length > 0 && !selectedProblem) {
        setSelectedProblem(all[0]);
      }
    } catch {
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  // Fetch real AI matches whenever selectedProblem changes
  useEffect(() => {
    if (!selectedProblem) return;
    setMatchingLoading(true);
    problemsApi.getMatches(selectedProblem.id)
      .then((m) => setMatches(m))
      .catch(() => setMatches([]))
      .finally(() => setMatchingLoading(false));
  }, [selectedProblem?.id]);

  const pending = problems.filter(p => p.status === 'SUBMITTED').length;
  const aiMatched = problems.filter(p => p.status === 'AI_CATEGORIZED').length;
  const active = problems.filter(p => p.status === 'ASSIGNED_TO_UNIVERSITY' || p.status === 'IN_PROGRESS').length;

  const handleAssign = async (universityId: string) => {
    if (!selectedProblem) return;
    setActionLoading(true);
    try {
      await problemsApi.assignUniversity(selectedProblem.id, universityId);
      alert('Academic Mandate Dispatched! Problem assigned to university research node.');
      await loadProblems();
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch mandate');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!selectedProblem) return;
    setActionLoading(true);
    try {
      await problemsApi.updateStatus(selectedProblem.id, status);
      alert(`Problem status updated to ${status}`);
      await loadProblems();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const topMatch = matches[0];

  const filteredProblems = problems.filter((p) => {
    const score = p.aiSeverity ?? (p.status === 'SUBMITTED' ? 75 : 45);
    if (severityFilter === 'CRITICAL' && score < 75) return false;
    if (severityFilter === 'MODERATE' && (score < 40 || score >= 75)) return false;
    if (severityFilter === 'STANDARD' && score >= 40) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchText = `${p.title} ${p.description} ${p.district} ${p.state} ${p.category}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-space-xl">

      {/* ─── Top Command Ribbon ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-xs p-space-lg">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-space-xs mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-md text-label-md bg-surface-container text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                GovOps Node ID: UP-URB-LKO-01
              </span>
              <span className="text-on-surface-variant/40 font-code text-code">•</span>
              <span className="font-code text-code text-on-surface-variant text-[11px] uppercase tracking-wider">Secured State Ledger</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mt-1">
              Municipal Admin & Zonal Officer Console
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Region: <span className="font-semibold text-on-surface">Uttar Pradesh Urban Development</span> • Jurisdiction: Lucknow, Varanasi & Kanpur Belts
            </p>
          </div>
          {/* Mode switcher + export */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="inline-flex p-1 rounded-xl bg-surface-container-low shadow-inner">
              <button
                onClick={() => setView('queue')}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all ${view === 'queue' ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Verification Queue
              </button>
              <Link
                to="/admin/matching"
                className="px-3 py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface flex items-center gap-1"
              >
                AI Matching Studio
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </Link>
            </div>
            <button
              onClick={() => alert('Exporting signed audit manifest for UP Urban Development Commission...')}
              className="px-space-md py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-label-md text-label-md flex items-center gap-1.5 hover:bg-surface-container transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              Export Audit Manifest
            </button>
          </div>
        </div>
      </section>

      {/* ─── KPI Strip ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-md">
        {[
          { icon: 'description', label: 'Total Civic Reports', val: String(problems.length), sub: 'State repository', color: 'text-primary' },
          { icon: 'assignment_late', label: 'Pending Initial Review', val: String(pending), sub: 'Action required', color: 'text-tertiary', border: 'border-l-4 border-l-tertiary' },
          { icon: 'psychology', label: 'AI Pre-Screened', val: String(aiMatched), sub: 'Ready for triage', color: 'text-primary' },
          { icon: 'school', label: 'Active University Deployments', val: String(active), sub: 'Research underway', color: 'text-primary' },
          { icon: 'speed', label: 'Avg Resolution Speed', val: '14.2 Days', sub: 'Target: 21 days', color: 'text-primary', progress: 68 },
        ].map(({ icon, label, val, sub, color, border }, i) => (
          <div key={i} className={`bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col justify-between ${border || ''}`}>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px] leading-tight">{label}</span>
              <span className={`material-symbols-outlined text-[18px] ${color}`}>{icon}</span>
            </div>
            <p className="font-headline-lg text-headline-lg font-bold">{val}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">{sub}</p>
          </div>
        ))}
      </section>

      {/* ─── AI Search & Filtering Controls ──────────────────────────────── */}
      <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-md shadow-xs flex flex-col md:flex-row items-center justify-between gap-space-md">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search problems, wards, or sectors…"
            className="w-full pl-9 pr-space-md py-2 rounded-xl border border-outline-variant bg-surface font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-xs"
          />
        </div>

        {/* AI Severity Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          <span className="text-xs font-semibold text-on-surface-variant uppercase mr-1">AI Triage:</span>
          {(['ALL', 'CRITICAL', 'MODERATE', 'STANDARD'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSeverityFilter(lvl)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                severityFilter === lvl
                  ? lvl === 'CRITICAL'
                    ? 'bg-error text-on-error shadow-xs'
                    : lvl === 'MODERATE'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {lvl === 'ALL' ? 'All Reports' : lvl === 'CRITICAL' ? '⚡ Critical (≥75)' : lvl === 'MODERATE' ? '⚠️ Moderate' : 'Standard'}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Main Content Area ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">

        {/* Left: Problem case cards */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          {loading ? (
            <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center">
              <span className="material-symbols-outlined text-4xl text-outline-variant block mb-2 animate-pulse">pending</span>
              <p className="font-body-md text-body-md text-on-surface-variant">Loading civic reports…</p>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">No matching civic reports found.</p>
            </div>
          ) : (
            filteredProblems.map((p: Problem) => (
              <div
                key={p.id}
                onClick={() => setSelectedProblem(p)}
                className={`bg-surface-container-lowest rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden ${selectedProblem?.id === p.id ? 'ring-2 ring-primary' : ''}`}
              >
                {/* Case header */}
                <div className="px-space-lg pt-space-lg pb-space-md border-b border-outline-variant/20">
                  <div className="flex flex-wrap items-center gap-space-sm mb-space-sm">
                    <span className="px-2.5 py-0.5 rounded bg-inverse-surface text-inverse-on-surface font-code text-code text-[11px]">
                      CASE #{p.id.slice(0, 8).toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm text-[11px]">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {p.district}, {p.state}
                    </div>
                    {p.status === 'ASSIGNED_TO_UNIVERSITY' && (
                      <span className="ml-auto flex items-center gap-1 font-label-md text-label-md text-primary text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        ASSIGNED
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-space-xs mb-space-sm">
                    {/* AI Threat / Severity Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-label-md text-label-md font-semibold text-[11px] flex items-center gap-1 ${
                        (p.aiSeverity ?? 75) >= 75
                          ? 'bg-error-container text-on-error-container'
                          : (p.aiSeverity ?? 75) >= 40
                          ? 'bg-amber-500/15 text-amber-800 dark:text-amber-200'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">bolt</span>
                      AI Threat Index: {p.aiSeverity ?? (p.status === 'SUBMITTED' ? 85 : 45)}/100
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md text-[11px]">
                      {p.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h2 className="font-headline-md text-headline-md text-on-surface mb-space-xs">{p.title}</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Logged by Verified Resident ({p.submittedBy?.name || 'Citizen'}) • Address: {p.address}
                  </p>
                </div>

                {/* Narrative */}
                <div className="p-space-lg">
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
                    {p.description}
                  </p>

                  {/* Attached Ground Evidence (Photos & Videos) */}
                  {p.mediaUrls && p.mediaUrls.length > 0 && (
                    <div className="mt-space-md pt-space-sm border-t border-outline-variant/20">
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px] mb-2">
                        Attached Telemetry Evidence ({p.mediaUrls.length} Files)
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs">
                        {p.mediaUrls.map((url: string, idx: number) => {
                          const isVid = /\.(mp4|mov|webm|mkv)$/i.test(url);
                          const fullUrl = url.startsWith('http')
                            ? url
                            : `https://trisetubackend-production.up.railway.app${url}`;

                          return isVid ? (
                            <div key={idx} className="rounded-xl overflow-hidden bg-black aspect-video border border-outline-variant/30">
                              <video src={fullUrl} controls className="w-full h-full object-contain" />
                            </div>
                          ) : (
                            <a
                              key={idx}
                              href={fullUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="block rounded-xl overflow-hidden aspect-video bg-surface-container border border-outline-variant/30 hover:opacity-90 transition-opacity"
                            >
                              <img src={fullUrl} alt="Evidence" className="w-full h-full object-cover" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-space-lg pb-space-lg flex flex-wrap gap-space-sm border-t border-outline-variant/20 pt-space-md">
                  <button
                    disabled={actionLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (topMatch) handleAssign(topMatch.universityId);
                    }}
                    className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-1.5 hover:bg-primary-container transition-colors shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Approve & Match Mandate
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate('IN_PROGRESS');
                    }}
                    className="px-space-md py-2 rounded-xl border border-outline-variant text-on-surface font-label-lg text-label-lg flex items-center gap-1.5 hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    Mark In-Progress
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate('REJECTED');
                    }}
                    className="px-space-md py-2 rounded-xl bg-error-container text-on-error-container font-label-lg text-label-lg flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: AI Matching sidebar */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg">

          {/* Advisory header */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs">
            <div className="flex items-center gap-space-xs mb-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
              <p className="font-label-lg text-label-lg text-on-surface font-semibold">AI Recommendation Assistance</p>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
              Algorithms rank registered universities based on domain taxonomy, laboratory capacity, and geographic proximity. Final contractual engagement requires Administrative Sign-off.
            </p>
          </div>

          {/* Ranked Matches */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs">
            <div className="flex items-center justify-between mb-space-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Ranked Academic Matches</h3>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps text-[10px]">
                {matches.length} Candidates
              </span>
            </div>

            {matchingLoading ? (
              <div className="p-space-lg text-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-2xl mb-1">refresh</span>
                <p className="font-body-sm text-body-sm">Calculating vector matches…</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="p-space-md text-center text-on-surface-variant">
                <p className="font-body-sm text-body-sm">Select a problem to view candidate recommendations.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-space-md">
                {matches.map((m, i) => (
                  <div key={m.universityId} className="rounded-xl border border-outline-variant/30 overflow-hidden">
                    <div className="flex items-center justify-between p-space-sm bg-surface-container-low">
                      <div className="flex items-center gap-space-sm">
                        <div className={`w-8 h-8 rounded-lg ${i === 0 ? 'bg-primary' : 'bg-secondary'} flex items-center justify-center`}>
                          <span className="font-headline-sm text-headline-sm text-on-primary">#{i + 1}</span>
                        </div>
                        <div>
                          <p className="font-label-lg text-label-lg text-on-surface font-semibold">{m.name}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">{m.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-md text-label-md font-semibold text-[11px]">
                          {Math.round(m.matchScore * 100)}% Match
                        </span>
                      </div>
                    </div>
                    <div className="p-space-sm">
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mb-space-sm">{m.rationale}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-space-sm">
                        {m.matchingTags.map((tag, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-caps text-[9px]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mb-space-sm text-[11px] text-on-surface-variant">
                        <span>Lead: {m.leadContact}</span>
                        <span>Active Load: {m.activeLoad} Projects</span>
                      </div>

                      <button
                        disabled={actionLoading}
                        onClick={() => handleAssign(m.universityId)}
                        className="mt-space-sm w-full py-2 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-1.5 hover:bg-primary-container transition-colors shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">handshake</span>
                        {i === 0 ? 'Assign Problem & Tender RFP' : 'Select Academic Node'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Administrative Allocation Deck */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-[10px] mb-space-sm">Administrative Allocation Deck</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">State Civic Innovation Seed Fund (SCISF)</p>
            <div className="bg-surface-container-low rounded-lg p-space-sm mb-space-sm">
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px] mb-1">Target Academic Consortium</p>
              <p className="font-label-lg text-label-lg text-on-surface">
                {topMatch?.name || 'Academic Consortium Selected via AI'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-space-sm mb-space-md">
              <div className="bg-surface-container-low rounded-lg p-space-sm">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px] mb-1">Grant Allocation</p>
                <p className="font-headline-sm text-headline-sm text-on-surface">₹14,50,000</p>
              </div>
              <div className="bg-surface-container-low rounded-lg p-space-sm">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px] mb-1">Milestone Tranches</p>
                <p className="font-headline-sm text-headline-sm text-on-surface">3 Stages (30-40-30)</p>
              </div>
            </div>
            <button
              disabled={actionLoading || !topMatch}
              onClick={() => {
                if (topMatch) handleAssign(topMatch.universityId);
              }}
              className="w-full py-3 rounded-xl bg-inverse-surface text-inverse-on-surface font-headline-sm text-headline-sm flex items-center justify-center gap-space-xs hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
            >
              <span className="material-symbols-outlined">verified_user</span>
              Issue Formal Token & Dispatch Mandate
            </button>
            <p className="font-code text-code text-on-surface-variant text-[10px] text-center mt-space-xs">Immutable execution logged onto Uttar Pradesh Civic Data Mesh</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
