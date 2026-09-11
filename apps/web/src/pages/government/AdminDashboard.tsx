import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { problemsApi } from '../../api/problems.api';
import type { Problem } from '../../types';

type View = 'queue' | 'studio';

const AdminDashboard: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('queue');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  useEffect(() => {
    problemsApi.getAll()
      .then((all) => {
        setProblems(all);
        if (all.length > 0) setSelectedProblem(all[0]);
      })
      .catch(() => setProblems([]))
      .finally(() => setLoading(false));
  }, []);

  const pending = problems.filter(p => p.status === 'SUBMITTED').length;
  const aiMatched = problems.filter(p => p.status === 'AI_CATEGORIZED').length;
  const active = problems.filter(p => p.status === 'ASSIGNED_TO_UNIVERSITY').length;

  const MOCK_MATCHES = [
    { rank: 'IISc', name: 'Team Jal-Shuddhi', dept: 'Dept. of Chemical Engineering, IISc Bengaluru', score: '96% Match', vector: '0.9628', capabilities: '2 Nanomaterial filtration patents; functional pilot lake cleanup', lead: 'Dr. K. Ramanathan', researchers: 4, availability: 'Ready for Q3 Pilot deployment', bg: 'bg-primary' },
    { rank: 'BMS', name: 'Environmental Tech Lab', dept: 'BMS College of Engineering, Dept. of Civil Engineering', score: '88% Match', vector: '0.8814', capabilities: 'Low-cost solar water telemetry nodes, rapid colorimetric heavy-metal field kits', lead: 'Prof. S. Nandakumar', researchers: 3, availability: 'Lab Bench Verified', bg: 'bg-secondary' },
  ];

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
                GovOps Node ID: KA-URB-BLR-01
              </span>
              <span className="text-on-surface-variant/40 font-code text-code">•</span>
              <span className="font-code text-code text-on-surface-variant text-[11px] uppercase tracking-wider">Secured State Ledger</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mt-1">
              Municipal Admin & Zonal Officer Console
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Region: <span className="font-semibold text-on-surface">Karnataka Urban Development</span> • Zonal Jurisdiction: Bengaluru North & Peripheral Belts
            </p>
          </div>
          {/* Mode switcher + export */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="inline-flex p-1 rounded-xl bg-surface-container-low shadow-inner">
              <button
                onClick={() => setView('queue')}
                className={`flex items-center gap-1.5 px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all ${view === 'queue' ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                Problem Verification Queue
              </button>
              <button
                onClick={() => setView('studio')}
                className={`flex items-center gap-1.5 px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all ${view === 'studio' ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                AI University Matching Studio
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-space-md py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md shadow-xs hover:opacity-95 transition-opacity">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Audit Manifest
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-space-md mt-space-lg pt-space-md bg-surface-container-low/40 -mx-space-lg -mb-space-lg px-space-lg pb-space-lg rounded-b-xl">
          {[
            { label: 'Total Civic Reports', value: loading ? '—' : problems.length.toLocaleString(), icon: 'folder_open', sub: '+14% vs last cycle', subColor: 'text-primary', accent: '' },
            { label: 'Pending Initial Review', value: loading ? '—' : String(pending), icon: 'emergency_home', sub: 'Avg queue wait: 3.2 hrs', subColor: 'text-on-surface-variant', accent: 'border-t-2 border-tertiary', badge: 'Action Required', badgeColor: 'bg-tertiary/10 text-tertiary' },
            { label: 'AI Pre-Screened & Matched', value: loading ? '—' : String(aiMatched), icon: 'psychology', sub: 'Ready for final sign-off', subColor: 'text-on-surface-variant', accent: '' },
            { label: 'Active University Deployments', value: loading ? '—' : String(active), icon: 'domain_verification', sub: 'Across 14 Tier-1 labs', subColor: 'text-on-surface-variant', accent: '' },
            { label: 'Avg Resolution Speed', value: '34 Days', icon: 'schedule', sub: '', subColor: '', accent: '', progress: 68 },
          ].map(({ label, value, icon, sub, subColor, accent, badge, badgeColor, progress }) => (
            <div key={label} className={`flex flex-col p-space-sm rounded-xl bg-surface-container-lowest shadow-xs ${accent}`}>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-label-caps text-label-caps uppercase text-[10px]">{label}</span>
                <span className="material-symbols-outlined text-[16px]">{icon}</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight">{value}</span>
                {badge && <span className={`px-1.5 py-0.5 rounded-full font-label-caps text-label-caps text-[10px] ${badgeColor}`}>{badge}</span>}
              </div>
              {sub && <span className={`font-body-sm text-body-sm mt-0.5 text-[11px] ${subColor}`}>{sub}</span>}
              {progress !== undefined && (
                <div className="mt-1 w-full bg-surface-container-high rounded-full h-1">
                  <div className="bg-primary h-1 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
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
          ) : problems.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">No problems to review.</p>
            </div>
          ) : (
            problems.map((p) => (
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
                    <span className="ml-auto flex items-center gap-1 font-label-md text-label-md text-on-surface-variant text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                      {Math.floor(Math.random() * 48) + 1} HRS AGO
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-space-xs mb-space-sm">
                    {p.status === 'SUBMITTED' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-semibold text-[11px]">
                        URGENT PRIORITY
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md text-[11px]">
                      {p.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h2 className="font-headline-md text-headline-md text-on-surface mb-space-xs">{p.title}</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Verified Citizen Report • Impact Reach: ~18,400 Residents
                  </p>
                </div>

                {/* AI Threat Analysis */}
                <div className="mx-space-lg my-space-md p-space-md rounded-lg bg-surface-container border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold">TriSetu Automated Threat Analysis</span>
                    </div>
                    <div className="text-right">
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">Risk Index</p>
                      <p className="font-headline-md text-headline-md text-error font-bold">8.8 / 10</p>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Confidence Rating: 94.2% across 3 baseline sensor arrays</p>
                </div>

                {/* Description */}
                <div className="px-space-lg pb-space-md">
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-[10px] mb-space-xs">Detailed Incident Narrative</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">{p.description}</p>
                </div>

                {/* Technical domains */}
                <div className="px-space-lg pb-space-md">
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-[10px] mb-space-xs">AI-Extracted Technical Domains</p>
                  <div className="flex flex-wrap gap-space-xs">
                    {['Heavy metal filtration', 'Adsorption column', 'IoT water turbidity sensor', 'Chelation bio-filters'].map(tag => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md text-[11px]">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-space-lg pb-space-lg flex flex-wrap gap-space-sm border-t border-outline-variant/20 pt-space-md">
                  <button className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-1.5 hover:bg-primary-container transition-colors shadow-xs">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Approve for Matching
                  </button>
                  <button className="px-space-md py-2 rounded-xl border border-outline-variant text-on-surface font-label-lg text-label-lg flex items-center gap-1.5 hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-[18px]">help</span>
                    Request Clarification
                  </button>
                  <button className="px-space-md py-2 rounded-xl border border-outline-variant text-on-surface-variant font-label-lg text-label-lg flex items-center gap-1.5 hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-[18px]">alt_route</span>
                    Re-route to Works
                  </button>
                  <button className="px-space-md py-2 rounded-xl bg-error-container text-on-error-container font-label-lg text-label-lg flex items-center gap-1.5 hover:opacity-90 transition-opacity">
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
              Algorithms rank institutions based on publication proximity, active lab infrastructure, and historical pilot completion. Final contractual engagement requires Administrative Sign-off.
            </p>
          </div>

          {/* Ranked Matches */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs">
            <div className="flex items-center justify-between mb-space-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Ranked Academic Matches</h3>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps text-[10px]">2 High Matches</span>
            </div>
            <div className="flex flex-col gap-space-md">
              {MOCK_MATCHES.map((m, i) => (
                <div key={i} className="rounded-xl border border-outline-variant/30 overflow-hidden">
                  <div className="flex items-center justify-between p-space-sm bg-surface-container-low">
                    <div className="flex items-center gap-space-sm">
                      <div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center`}>
                        <span className="font-headline-sm text-headline-sm text-on-primary">{m.rank}</span>
                      </div>
                      <div>
                        <p className="font-label-lg text-label-lg text-on-surface font-semibold">{m.name}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">{m.dept}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-md text-label-md font-semibold text-[11px]">{m.score}</span>
                      <p className="font-code text-code text-on-surface-variant text-[11px] mt-0.5">Vector: {m.vector}</p>
                    </div>
                  </div>
                  <div className="p-space-sm">
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px] mb-space-2xs">Core Capabilities</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mb-space-sm">{m.capabilities}</p>
                    <div className="flex items-center justify-between mb-space-sm">
                      <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">person</span>
                        {m.lead} • {m.researchers} PhD Researchers
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`font-label-caps text-label-caps text-[10px] uppercase ${i === 0 ? 'text-primary' : 'text-tertiary'}`}>{m.availability}</span>
                    </div>
                    <button className="mt-space-sm w-full py-2 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-1.5 hover:bg-primary-container transition-colors shadow-xs">
                      <span className="material-symbols-outlined text-[16px]">handshake</span>
                      {i === 0 ? 'Assign Problem & Tender RFP' : 'Invite Co-Proposal'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Administrative Allocation Deck */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-[10px] mb-space-sm">Administrative Allocation Deck</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">Karnataka Urban Innovation Seed Fund (KUISF)</p>
            <div className="bg-surface-container-low rounded-lg p-space-sm mb-space-sm">
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px] mb-1">Target Academic Consortium</p>
              <p className="font-label-lg text-label-lg text-on-surface">Team Jal-Shuddhi (IISc Bengaluru)</p>
            </div>
            <div className="grid grid-cols-2 gap-space-sm mb-space-md">
              <div className="bg-surface-container-low rounded-lg p-space-sm">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px] mb-1">Grant Allocation</p>
                <p className="font-headline-sm text-headline-sm text-on-surface">₹2,50,000</p>
              </div>
              <div className="bg-surface-container-low rounded-lg p-space-sm">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px] mb-1">Milestone Tranches</p>
                <p className="font-headline-sm text-headline-sm text-on-surface">3 Stages (40-40-20)</p>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-inverse-surface text-inverse-on-surface font-headline-sm text-headline-sm flex items-center justify-center gap-space-xs hover:opacity-90 transition-opacity shadow-md">
              <span className="material-symbols-outlined">verified_user</span>
              Issue Formal Token & Dispatch Mandate
            </button>
            <p className="font-code text-code text-on-surface-variant text-[10px] text-center mt-space-xs">Immutable execution logged onto Karnataka State Civic Data Mesh</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
