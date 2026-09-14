import React, { useState, useEffect } from 'react';
import { projectsApi } from '../../api/projects.api';
import StatusBadge from '../../components/ui/StatusBadge';
import type { Proposal } from '../../types';

const ProposalReview: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<Proposal | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const data = await projectsApi.getAllProposals();
      setProposals(data);
    } catch (err) {
      console.error('Failed to load proposals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();

    const handleTelemetry = () => {
      fetchProposals();
    };
    window.addEventListener('samadhan:telemetry', handleTelemetry);
    return () => window.removeEventListener('samadhan:telemetry', handleTelemetry);
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await projectsApi.updateProposalStatus(id, 'APPROVED');
      setStatusNote('Proposal approved! 3 Milestone tranches generated and escrow unlocked.');
      await fetchProposals();
      setSelected(null);
    } catch (err: any) {
      alert(err.message || 'Failed to approve proposal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(true);
    try {
      await projectsApi.updateProposalStatus(id, 'REJECTED');
      setStatusNote('Proposal rejected.');
      await fetchProposals();
      setSelected(null);
    } catch (err: any) {
      alert(err.message || 'Failed to reject proposal');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProposals = proposals.filter((p) => {
    if (filter === 'PENDING') return p.status === 'SUBMITTED';
    if (filter === 'APPROVED') return p.status === 'APPROVED';
    if (filter === 'REJECTED') return p.status === 'REJECTED';
    return true;
  });

  const pendingCount = proposals.filter((p) => p.status === 'SUBMITTED').length;

  return (
    <div className="p-space-lg max-w-7xl mx-auto space-y-space-lg">
      {/* Header Horizon */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-container/20 text-primary mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Municipal Zonal Scrutiny Desk • Step 3/5
            </div>
            <h1 className="text-2xl font-black text-on-surface font-headline tracking-tight">
              Academic Proposal Scrutiny & Approval
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Review university engineering feasibility proposals and activate milestone-bound deployment projects.
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-right">
            <div className="text-xs text-on-surface-variant font-medium">Action Required</div>
            <div className="text-sm font-bold text-primary">{pendingCount} Pending Reviews</div>
          </div>
        </div>
      </div>

      {statusNote && (
        <div className="p-4 rounded-xl bg-success-container/30 border border-success/30 text-success text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {statusNote}
          </div>
          <button onClick={() => setStatusNote(null)} className="text-xs font-bold">✕</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-4">
        {[
          { id: 'ALL', label: `All Proposals (${proposals.length})` },
          { id: 'PENDING', label: `Pending Scrutiny (${pendingCount})` },
          { id: 'APPROVED', label: 'Approved & Active' },
          { id: 'REJECTED', label: 'Rejected' },
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

      {/* Proposals Feed */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-on-surface-variant">Loading academic proposals from Neon DB...</p>
        </div>
      ) : filteredProposals.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">description</span>
          <h3 className="text-base font-bold text-on-surface">No proposals in this category</h3>
          <p className="text-xs text-on-surface-variant mt-1">Check back as universities submit new engineering designs.</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden divide-y divide-outline-variant/20">
          {filteredProposals.map((p) => {
            const budgetInLakhs = (p.budgetRequired / 100000).toFixed(2);
            const univName = p.university?.name || (p as any).universityName || 'Academic Institution';
            const probTitle = p.problem?.title || (p as any).problemTitle || 'Civic Infrastructure Issue';

            return (
              <div
                key={p.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-container-low/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-surface-container text-on-surface-variant">
                      {p.problem?.category || 'MUNICIPAL'}
                    </span>
                    <span className="text-xs text-primary font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">school</span>
                      {univName}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-on-surface font-headline truncate">
                    {p.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                    Addressing Problem: <strong className="text-on-surface">{probTitle}</strong>
                  </p>
                  <div className="flex items-center gap-4 text-xs text-on-surface-variant mt-2">
                    <span>Budget: <strong className="text-on-surface">₹{budgetInLakhs} Lakhs</strong></span>
                    <span>•</span>
                    <span>Timeline: <strong className="text-on-surface">{p.timelineMonths} Months</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={p.status} />
                  <button
                    onClick={() => setSelected(p)}
                    className="px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs hover:bg-primary/90 transition-all shadow-xs"
                  >
                    Scrutinize Proposal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal Drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-container/20 text-primary">
                  Engineering Feasibility Dossier
                </span>
                <h2 className="text-xl font-black text-on-surface font-headline mt-1">
                  {selected.title}
                </h2>
                <div className="text-xs text-primary font-medium mt-1">
                  {selected.university?.name || (selected as any).universityName}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                <div className="text-on-surface-variant font-medium">Problem Statement Addressed:</div>
                <div className="font-bold text-on-surface text-sm">
                  {selected.problem?.title || (selected as any).problemTitle}
                </div>
              </div>

              <div>
                <span className="font-bold text-on-surface uppercase tracking-wider text-[11px]">
                  Technical Abstract & Methodology:
                </span>
                <p className="text-on-surface-variant leading-relaxed mt-1 p-3 rounded-xl bg-surface border border-outline-variant/30">
                  {selected.abstract}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div className="text-on-surface-variant text-[11px]">Requested Budget</div>
                  <div className="text-lg font-black text-on-surface font-headline">
                    ₹{(selected.budgetRequired / 100000).toFixed(2)} Lakhs
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div className="text-on-surface-variant text-[11px]">Deployment Timeline</div>
                  <div className="text-lg font-black text-on-surface font-headline">
                    {selected.timelineMonths} Months
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container text-[11px] text-on-surface-variant flex items-start gap-2">
                <span className="material-symbols-outlined text-sm text-primary flex-shrink-0 mt-0.5">verified_user</span>
                <span>
                  Approving this proposal will auto-generate 3 milestone tranches (M1 30%, M2 40%, M3 30%), activate escrow holding, and advance the problem to Active Development.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setSelected(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                Close
              </button>

              {selected.status === 'SUBMITTED' && (
                <>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleReject(selected.id)}
                    className="px-4 py-2.5 rounded-xl border border-error/40 text-error text-xs font-semibold hover:bg-error/5"
                  >
                    Reject Proposal
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleApprove(selected.id)}
                    className="px-5 py-2.5 rounded-xl bg-success text-on-primary text-xs font-semibold hover:bg-success/90 transition-all flex items-center gap-2 shadow-xs"
                  >
                    {actionLoading ? 'Activating Project...' : '✓ Approve & Activate Tranches'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalReview;
