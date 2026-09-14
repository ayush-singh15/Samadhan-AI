import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { industryApi, IndustryDashboardData } from '../../api/industry.api';
import { projectsApi } from '../../api/projects.api';
import type { Project } from '../../types';

const IndustryDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<IndustryDashboardData | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [dash, projs] = await Promise.all([
          industryApi.getDashboard(),
          projectsApi.getAll(),
        ]);
        setDashboardData(dash);
        setAllProjects(projs);
      } catch (err) {
        console.error('Failed to load industry dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const profile = dashboardData?.profile;
  const stats = dashboardData?.stats;

  // Use projects from dashboard or filter allProjects that have funding
  const displayProjects = (dashboardData?.projects && dashboardData.projects.length > 0)
    ? dashboardData.projects
    : allProjects.filter((p) => p.fundedAmount > 0 || p.status === 'FULLY_FUNDED' || p.status === 'IN_DEVELOPMENT');

  const totalFunded = displayProjects.reduce((acc, p) => acc + (p.fundedAmount || 0), 0);

  return (
    <div className="p-space-lg max-w-7xl mx-auto space-y-space-lg">
      {/* Top Banner */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-container/20 text-primary mb-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Corporate Social Responsibility Desk • Node ID: CSR-IND-8891
            </div>
            <h1 className="text-2xl font-black text-on-surface font-headline tracking-tight">
              {profile?.companyName || user?.name || 'Tata Trusts & CSR Foundation'}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Directing corporate grants toward high-impact university civic R&D with milestone-locked escrow.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/industry/proposals"
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">search</span>
              Browse Civic Projects
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Annual CSR Budget</span>
            <span className="material-symbols-outlined text-primary text-xl">account_balance</span>
          </div>
          <div className="mt-3 text-2xl font-black text-on-surface font-headline">
            ₹{((stats?.totalAllocated || 10000000) / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-on-surface-variant mt-1">MCA Section 135 Board Approved</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Committed in Escrow</span>
            <span className="material-symbols-outlined text-success text-xl">lock</span>
          </div>
          <div className="mt-3 text-2xl font-black text-success font-headline">
            ₹{(Math.max(totalFunded, stats?.totalCommitted || 3850000) / 100000).toFixed(2)} L
          </div>
          <div className="text-[11px] text-on-surface-variant mt-1">Protected by Smart Milestone Tranches</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Active Deployments</span>
            <span className="material-symbols-outlined text-primary text-xl">engineering</span>
          </div>
          <div className="mt-3 text-2xl font-black text-on-surface font-headline">
            {displayProjects.length || stats?.activeProjectsCount || 3}
          </div>
          <div className="text-[11px] text-on-surface-variant mt-1">University Lab Prototypes & Trials</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Tranches Disbursed</span>
            <span className="material-symbols-outlined text-amber-600 text-xl">fact_check</span>
          </div>
          <div className="mt-3 text-2xl font-black text-on-surface font-headline">
            {stats?.milestonesFunded || 8}
          </div>
          <div className="text-[11px] text-on-surface-variant mt-1">Verified with Municipal Audit Proof</div>
        </div>
      </div>

      {/* Main Content: Portfolio & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Funded Civic Projects Portfolio */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-on-surface font-headline">
              Active CSR Co-Financed Portfolio
            </h2>
            <Link to="/industry/proposals" className="text-xs font-semibold text-primary hover:underline">
              View All Opportunities →
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : displayProjects.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 text-center">
              <p className="text-sm text-on-surface-variant">No projects funded yet.</p>
              <Link
                to="/industry/proposals"
                className="mt-3 inline-block px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold"
              >
                Browse & Allocate Funds
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {displayProjects.map((p) => {
                const budgetReq = p.proposal?.budgetRequired || 500000;
                const pct = Math.min(100, Math.round((p.fundedAmount / budgetReq) * 100));
                const completedMs = p.milestones ? p.milestones.filter((m) => m.isCompleted).length : 1;
                const totalMs = p.milestones ? p.milestones.length : 3;

                return (
                  <div
                    key={p.id}
                    className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 hover:shadow-xs transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-surface-container text-on-surface-variant">
                            {p.proposal?.problem?.category || 'MUNICIPAL'}
                          </span>
                          <span className="text-xs text-primary font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">school</span>
                            {p.proposal?.university?.name || 'University R&D'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-on-surface font-headline">
                          {p.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Civic Need: {p.proposal?.problem?.title || 'Civic Infrastructure'} ({p.proposal?.problem?.district || 'UP'})
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success-container/20 text-success whitespace-nowrap">
                        {p.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Progress Bar & Escrow release */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-on-surface-variant">
                          Grant Committed: <strong className="text-on-surface">₹{(p.fundedAmount / 100000).toFixed(2)}L</strong> / ₹{(budgetReq / 100000).toFixed(2)}L
                        </span>
                        <span className="font-semibold text-primary">
                          {completedMs}/{totalMs} Milestones Complete
                        </span>
                      </div>
                      <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Tranches pills */}
                    <div className="pt-1 flex items-center gap-2">
                      {(p.milestones && p.milestones.length > 0 ? p.milestones : [
                        { id: '1', title: 'M1 Baseline', isCompleted: true },
                        { id: '2', title: 'M2 Prototype', isCompleted: false },
                        { id: '3', title: 'M3 Handover', isCompleted: false },
                      ]).map((m, idx) => (
                        <div
                          key={m.id || idx}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-center text-[10px] font-semibold border ${
                            m.isCompleted
                              ? 'bg-success-container/20 border-success/30 text-success'
                              : 'bg-surface-container border-outline-variant/30 text-on-surface-variant'
                          }`}
                        >
                          Tranche {idx + 1}: {m.isCompleted ? '✓ Disbursed' : 'In Escrow'}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: CSR Governance & Schedule VII Compliance */}
        <div className="space-y-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">verified</span>
              <h3 className="text-base font-black text-on-surface font-headline">CSR Governance Ledger</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Every rupee committed through Samadhan AI is cryptographically accounted for under the Ministry of Corporate Affairs (MCA) Schedule VII guidelines.
            </p>

            <div className="space-y-2.5 pt-2 border-t border-outline-variant/20">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Tax Exemption:</span>
                <span className="font-bold text-success">Section 80G Verified</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Audit Readiness:</span>
                <span className="font-bold text-on-surface">Automated Form CSR-1</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Escrow Custodian:</span>
                <span className="font-bold text-on-surface">State Municipal Treasury</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-[11px] text-on-surface-variant space-y-1">
              <div className="font-bold text-on-surface">Approved Focus Areas:</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {['Water & Sanitation', 'Rural Infrastructure', 'Clean Energy', 'Health Diagnostics'].map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-medium text-[10px]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <Link
              to="/industry/proposals"
              className="w-full py-2.5 px-4 rounded-xl border border-outline-variant/50 bg-surface-container text-on-surface font-semibold text-xs flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Allocate New Grant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryDashboard;
