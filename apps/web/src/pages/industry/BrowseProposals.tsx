import React, { useState, useEffect } from 'react';
import { projectsApi } from '../../api/projects.api';
import { industryApi } from '../../api/industry.api';
import type { Project } from '../../types';

const BrowseProposals: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [grantAmount, setGrantAmount] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (err: any) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenGrant = (p: Project) => {
    setSelectedProject(p);
    const budgetReq = p.proposal?.budgetRequired || 500000;
    const remaining = Math.max(0, budgetReq - p.fundedAmount);
    setGrantAmount(remaining > 0 ? remaining.toString() : '100000');
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setGrantAmount('');
    setErrorMsg(null);
  };

  const handleSubmitGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    const amount = Number(grantAmount);
    if (!amount || amount <= 0) {
      setErrorMsg('Please enter a valid grant amount greater than 0.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      await industryApi.submitFundingOffer(selectedProject.id, amount);
      setSuccessMsg(`₹${(amount / 100000).toFixed(2)} Lakhs grant committed to escrow for "${selectedProject.title}".`);
      await fetchProjects();
      setTimeout(() => {
        handleCloseModal();
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit funding offer.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const budgetReq = p.proposal?.budgetRequired || 500000;
    const remaining = Math.max(0, budgetReq - p.fundedAmount);
    if (filter === 'NEEDS_FUNDING') return remaining > 0;
    if (filter === 'FULLY_FUNDED') return remaining === 0 || p.status === 'FULLY_FUNDED';
    if (filter === 'IN_DEV') return p.status === 'IN_DEVELOPMENT';
    return true;
  });

  return (
    <div className="p-space-lg max-w-7xl mx-auto space-y-space-lg">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-container/20 text-primary mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Schedule VII • MCA Section 135 Compliant
            </div>
            <h1 className="text-2xl font-black text-on-surface font-headline tracking-tight">
              CSR Funding Allocation Desk
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Co-finance verified university engineering solutions for high-priority municipal civic challenges.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-right">
              <div className="text-xs text-on-surface-variant font-medium">80G Tax Exemption</div>
              <div className="text-sm font-bold text-success">100% Deductible</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
        <div className="flex items-center gap-2">
          {[
            { id: 'ALL', label: 'All Projects' },
            { id: 'NEEDS_FUNDING', label: 'Requires CSR Grant' },
            { id: 'IN_DEV', label: 'In Development' },
            { id: 'FULLY_FUNDED', label: 'Fully Funded' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-on-surface-variant font-medium">
          Showing {filteredProjects.length} projects
        </span>
      </div>

      {/* Success Banner */}
      {successMsg && !selectedProject && (
        <div className="p-4 rounded-xl bg-success-container/30 border border-success/30 text-success text-sm font-medium flex items-center gap-3">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          {successMsg}
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-on-surface-variant font-medium">Loading live university projects from Neon DB...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">account_balance_wallet</span>
          <h3 className="text-lg font-bold text-on-surface">No projects found</h3>
          <p className="text-sm text-on-surface-variant mt-1">There are no projects currently matching this criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((p) => {
            const budgetReq = p.proposal?.budgetRequired || 500000;
            const remaining = Math.max(0, budgetReq - p.fundedAmount);
            const pctFunded = Math.min(100, Math.round((p.fundedAmount / budgetReq) * 100));
            const universityName = p.proposal?.university?.name || 'Assigned University R&D';
            const problemTitle = p.proposal?.problem?.title || 'Civic Infrastructure Problem';
            const district = p.proposal?.problem?.district || 'Uttar Pradesh';

            return (
              <div
                key={p.id}
                className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-all space-y-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant border border-outline-variant/40">
                      {p.proposal?.problem?.category || 'MUNICIPAL'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      pctFunded >= 100
                        ? 'bg-success-container/30 text-success'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {pctFunded >= 100 ? 'Fully Funded' : `${pctFunded}% Funded`}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-on-surface font-headline leading-snug">
                    {p.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-xs text-primary font-medium">
                    <span className="material-symbols-outlined text-sm">school</span>
                    <span>{universityName}</span>
                  </div>

                  <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    Addressing: {problemTitle} ({district})
                  </p>

                  {/* Budget / Funding Progress Bar */}
                  <div className="mt-5 p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-on-surface-variant font-medium">Funded: ₹{(p.fundedAmount / 100000).toFixed(2)}L</span>
                      <span className="font-bold text-on-surface">Target: ₹{(budgetReq / 100000).toFixed(2)}L</span>
                    </div>
                    <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pctFunded >= 100 ? 'bg-success' : 'bg-primary'
                        }`}
                        style={{ width: `${pctFunded}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1">
                      <span>Remaining Gap: <strong className="text-on-surface">₹{(remaining / 100000).toFixed(2)}L</strong></span>
                      <span>Escrow Protected</span>
                    </div>
                  </div>

                  {/* Milestones Preview */}
                  <div className="mt-4">
                    <div className="text-xs font-semibold text-on-surface mb-2 flex items-center justify-between">
                      <span>Milestone Escrow Tranches</span>
                      <span className="text-on-surface-variant text-[11px]">
                        {p.milestones ? p.milestones.length : 3} Tranches
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(p.milestones && p.milestones.length > 0 ? p.milestones : [
                        { id: '1', title: 'M1 Baseline', fundingPercentage: 30, isCompleted: true },
                        { id: '2', title: 'M2 Prototype', fundingPercentage: 40, isCompleted: false },
                        { id: '3', title: 'M3 Handover', fundingPercentage: 30, isCompleted: false },
                      ]).map((m, idx) => (
                        <div
                          key={m.id || idx}
                          className={`p-2 rounded-lg border text-center text-[10px] font-medium ${
                            m.isCompleted
                              ? 'bg-success-container/20 border-success/30 text-success'
                              : 'bg-surface-container border-outline-variant/30 text-on-surface-variant'
                          }`}
                        >
                          <div className="font-bold">M{idx + 1} ({m.fundingPercentage}%)</div>
                          <div>{m.isCompleted ? 'Disbursed' : 'In Escrow'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-2">
                  <button
                    onClick={() => handleOpenGrant(p)}
                    className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-semibold text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">payments</span>
                    Allocate CSR Grant
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Grant Allocation Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-container/20 text-primary">
                  Escrow Tranche Funding
                </span>
                <h2 className="text-xl font-black text-on-surface font-headline mt-1">
                  Commit CSR Grant
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1 text-xs">
              <div className="font-bold text-on-surface">{selectedProject.title}</div>
              <div className="text-on-surface-variant">
                Implementing Partner: {selectedProject.proposal?.university?.name || 'IIT R&D Lab'}
              </div>
              <div className="text-on-surface-variant">
                Target Budget: ₹{((selectedProject.proposal?.budgetRequired || 500000) / 100000).toFixed(2)} Lakhs
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-error-container/30 border border-error/30 text-error text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-success-container/30 border border-success/30 text-success text-xs font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmitGrant} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                  Grant Amount (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="5000"
                    value={grantAmount}
                    onChange={(e) => setGrantAmount(e.target.value)}
                    required
                    placeholder="500000"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-surface border border-outline-variant/50 text-on-surface font-headline font-semibold text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex items-center gap-2">
                {[
                  { label: '₹1 Lakh', val: 100000 },
                  { label: '₹2.5 Lakh', val: 250000 },
                  { label: 'Full Gap', val: Math.max(0, (selectedProject.proposal?.budgetRequired || 500000) - selectedProject.fundedAmount) },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setGrantAmount(preset.val.toString())}
                    className="flex-1 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-container text-[11px] font-medium text-on-surface hover:bg-surface-container-high transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-surface-container text-[11px] text-on-surface-variant flex items-start gap-2">
                <span className="material-symbols-outlined text-sm text-primary flex-shrink-0 mt-0.5">verified_user</span>
                <span>
                  Funds are held in an automated smart escrow account and released in tranches only upon verified milestone completion and municipal sign-off.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                      Locking in Escrow...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">lock</span>
                      Confirm & Commit Escrow
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseProposals;
