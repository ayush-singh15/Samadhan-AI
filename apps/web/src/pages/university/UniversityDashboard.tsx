import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { problemsApi } from '../../api/problems.api';
import { mock_proposals, mock_projects } from '../../mocks';
import type { Problem } from '../../types';

const TABS = [
  { icon: 'travel_explore', label: '1. Open Civic Challenges' },
  { icon: 'architecture', label: '2. Solution Proposal Studio' },
  { icon: 'lock_clock', label: '3. Escrow & Milestones' },
  { icon: 'biotech', label: 'Lab Equipment Registry' },
];

const UniversityDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const proposals = mock_proposals;
  const projects = mock_projects;

  useEffect(() => {
    problemsApi.getAll()
      .then((all) => setProblems(all.filter((p) => p.status === 'ASSIGNED_TO_UNIVERSITY')))
      .catch(() => setProblems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = problems.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.district.toLowerCase().includes(search.toLowerCase())
  );

  const liveDeployments = projects.filter((p) => p.status === 'IN_DEVELOPMENT').length;
  const inReview = proposals.filter((p) => p.status === 'SUBMITTED').length;
  const activeGrants = projects.reduce((s, p) => s + p.fundedAmount, 0);

  return (
    <div className="flex flex-col w-full">
      {/* ─── Academic R&D Node Header ─────────────────────────────────────── */}
      <section className="relative bg-surface-container-lowest rounded-xl shadow-xs p-space-lg mb-space-xl overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
          <div className="flex flex-col max-w-3xl">
            <div className="flex items-center gap-space-xs mb-space-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps uppercase tracking-wider">
                Academic R&D Node
              </span>
              <span className="text-outline-variant font-code text-code text-[11px]">
                INST-ID: {user?.id?.slice(0, 12).toUpperCase() ?? 'UNIV-001'}
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              {user?.name ?? 'University Portal'}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Joint Academic Consortium with National Institutes of Technology | Deep-Tech Civic Deployment Cell
            </p>
          </div>

          {/* Live stats row */}
          <div className="flex flex-wrap items-center gap-space-sm bg-surface-container-low p-space-sm rounded-xl">
            <div className="flex items-center gap-space-xs px-space-sm py-1.5 bg-surface-container-lowest rounded-lg shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface leading-none">{loading ? '—' : liveDeployments}</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Live Deployments</span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs px-space-sm py-1.5 bg-surface-container-lowest rounded-lg shadow-xs">
              <span className="material-symbols-outlined text-tertiary text-[20px]">hourglass_top</span>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface leading-none">{inReview}</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">In Gov Review</span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs px-space-sm py-1.5 bg-surface-container-lowest rounded-lg shadow-xs">
              <span className="material-symbols-outlined text-primary-container text-[20px]">account_balance_wallet</span>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary leading-none">₹{(activeGrants / 100000).toFixed(1)}L</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Active Seed Grants</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mt-space-lg flex items-center gap-space-xs overflow-x-auto pb-1">
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === i
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Tab Content ──────────────────────────────────────────────────── */}
      {activeTab === 0 && (
        <section className="mb-space-3xl">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-base gap-space-sm">
            <div>
              <div className="flex items-center gap-1.5 text-primary font-label-caps text-label-caps uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-[16px]">sensors</span>
                Stage 01: Sourcing
              </div>
              <h2 className="font-headline-xl text-headline-xl text-on-surface">Problem Discovery & Open Civic Challenges</h2>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
              Validated municipal pain-points assigned to your institution.
            </p>
          </div>

          {/* Search bar */}
          <div className="bg-surface-container-lowest p-space-base rounded-xl shadow-xs mb-space-lg flex flex-col lg:flex-row gap-space-sm items-center">
            <div className="relative w-full lg:w-2/5">
              <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-outline text-[20px]">search</span>
              <input
                className="w-full bg-surface pl-10 pr-4 py-2.5 rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-low transition-colors"
                placeholder="Search challenges by municipality, issue or keyword..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs w-full lg:w-3/5">
              <select className="w-full bg-surface text-on-surface font-label-md text-label-md rounded-lg px-3 py-2.5 focus:outline-none border border-outline-variant/40">
                <option>Domain: All Technical Fields</option>
                <option>IoT / Hardware Mesh</option>
                <option>Biotech & Sanitation</option>
                <option>Civil / Structural Sensors</option>
                <option>AI / Vision & Software</option>
              </select>
              <select className="w-full bg-surface text-on-surface font-label-md text-label-md rounded-lg px-3 py-2.5 focus:outline-none border border-outline-variant/40">
                <option>All Categories</option>
                <option>Water Sanitation</option>
                <option>Infrastructure</option>
                <option>Environment</option>
                <option>Healthcare</option>
              </select>
            </div>
          </div>

          {/* Problem cards */}
          {loading ? (
            <div className="bg-surface-container-lowest rounded-xl p-space-lg text-center text-on-surface-variant animate-pulse">
              Loading assigned challenges…
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-outline-variant block mb-2">travel_explore</span>
              <p className="font-body-md text-body-md">No challenges currently assigned to your institution.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-space-lg">
              {filtered.map((p) => (
                <div key={p.id} className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                  {/* Main card */}
                  <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-xl" />
                    <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
                      <div className="flex flex-wrap items-center gap-space-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md font-semibold">
                          {p.category.replace(/_/g, ' ')}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-secondary-container font-label-md text-label-md">
                          Assigned Challenge
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs">{p.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mb-space-md">
                      <span className="material-symbols-outlined text-primary text-[16px]">location_on</span>
                      {p.address}, {p.district}, {p.state}
                    </p>

                    {/* Allocated funding info */}
                    <div className="flex gap-space-lg mb-space-md p-space-sm bg-surface-container-low rounded-lg">
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-0.5">Civic Stakeholder</p>
                        <p className="font-label-md text-label-md text-on-surface">Municipal Corporation</p>
                      </div>
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-0.5">CSR Grant Funder</p>
                        <p className="font-label-md text-label-md text-on-surface">Tata Sustainability Fund</p>
                      </div>
                    </div>

                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mb-space-md">
                      {p.description}
                    </p>

                    <div className="flex items-center gap-space-sm pt-space-sm border-t border-outline-variant/20">
                      <Link
                        to={`/university/proposals/new/${p.id}`}
                        className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-1.5 shadow-xs hover:bg-primary-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit_note</span>
                        Submit Technical Proposal
                      </Link>
                      <button className="px-space-md py-2 rounded-lg border border-outline-variant text-on-surface-variant font-label-lg text-label-lg flex items-center gap-1.5 hover:bg-surface-container-low transition-colors">
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        View Ground Data
                      </button>
                    </div>
                  </div>

                  {/* Sidebar card — location info */}
                  <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-md shadow-xs">
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-space-sm">Transfer Shed Location</p>
                    <div className="bg-surface-container-low rounded-lg h-28 flex items-center justify-center mb-space-sm">
                      <div className="text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-4xl text-outline-variant">map</span>
                        <p className="font-label-sm text-[11px] mt-1">GIS Map — {p.district}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-space-xs">
                      <div className="bg-surface-container-low rounded-lg p-space-xs text-center">
                        <p className="font-code text-code text-[10px] text-on-surface-variant uppercase">Avg Sorting</p>
                        <p className="font-headline-sm text-headline-sm text-error">42.0% Mixed</p>
                      </div>
                      <div className="bg-surface-container-low rounded-lg p-space-xs text-center">
                        <p className="font-code text-code text-[10px] text-on-surface-variant uppercase">Grant Size</p>
                        <p className="font-headline-sm text-headline-sm text-primary">₹25L</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 1 && (
        <section className="mb-space-3xl">
          <div className="flex items-center gap-1.5 text-primary font-label-caps text-label-caps uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">architecture</span>
            Stage 02: Collaborative Authoring
          </div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface mb-space-lg">Interactive Solution Proposal Editor</h2>
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs text-center">
            <span className="material-symbols-outlined text-4xl text-outline-variant block mb-2">edit_document</span>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">Select a problem from the Civic Challenges tab to open the proposal editor.</p>
            <button onClick={() => setActiveTab(0)} className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg">
              Browse Challenges
            </button>
          </div>
        </section>
      )}

      {activeTab === 2 && (
        <section>
          <div className="flex items-center gap-1.5 text-primary font-label-caps text-label-caps uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">lock_clock</span>
            Stage 03: Live Governance & Escrow
          </div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface mb-space-lg">Active Project Milestone Tracking</h2>
          {projects.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center text-on-surface-variant">No active projects yet.</div>
          ) : (
            <div className="flex flex-col gap-space-lg">
              {projects.map((project) => {
                const done = project.milestones.filter((m) => m.isCompleted).length;
                const total = project.milestones.length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={project.id} className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs">
                    <div className="flex items-center justify-between mb-space-md">
                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface">{project.title}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{project.universityName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Grant</p>
                        <p className="font-headline-sm text-headline-sm text-primary">₹{(project.fundedAmount / 100000).toFixed(1)}L</p>
                      </div>
                    </div>
                    <div className="mb-space-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-label-md text-label-md text-on-surface-variant">Progress to Milestone {done} Sign-Off</span>
                        <span className="font-label-md text-label-md text-primary font-semibold">{pct}% Complete</span>
                      </div>
                      <div className="w-full bg-surface-container-high rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full progress-bar" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <Link
                      to={`/university/projects/${project.id}/milestones`}
                      className="inline-flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg mt-space-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">fact_check</span>
                      Track Milestones
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {activeTab === 3 && (
        <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl text-outline-variant block mb-2">biotech</span>
          <p className="font-body-md text-body-md">Lab Equipment Registry coming soon.</p>
        </div>
      )}
    </div>
  );
};

export default UniversityDashboard;
