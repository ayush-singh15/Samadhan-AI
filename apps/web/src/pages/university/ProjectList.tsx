import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi } from '../../api/projects.api';
import type { Project } from '../../types';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    const handleTelemetry = () => {
      fetchProjects();
    };
    window.addEventListener('samadhan:telemetry', handleTelemetry);
    return () => window.removeEventListener('samadhan:telemetry', handleTelemetry);
  }, []);

  return (
    <div className="p-space-lg max-w-7xl mx-auto space-y-space-lg">
      {/* Header Horizon */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-container/20 text-primary mb-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Academic R&D Operations Desk
            </div>
            <h1 className="text-2xl font-black text-on-surface font-headline tracking-tight">
              Active Civic Deployment Projects
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Track multi-milestone physical deployments, material testing, and escrow disbursement status.
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-right">
            <div className="text-xs text-on-surface-variant font-medium">Active Portfolio</div>
            <div className="text-sm font-bold text-on-surface">{projects.length} Projects in Progress</div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-on-surface-variant">Loading live university projects from Neon DB...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">folder_open</span>
          <h3 className="text-base font-bold text-on-surface">No active deployment projects yet</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Proposals approved by Zonal Administration will appear here with active milestone tranches.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => {
            const milestones = p.milestones || [];
            const done = milestones.filter((m) => m.isCompleted).length;
            const total = milestones.length || 3;
            const pct = Math.round((done / total) * 100);
            const budgetInLakhs = (p.fundedAmount / 100000).toFixed(2);
            const probTitle = p.proposal?.problem?.title || (p as any).problemTitle || 'Civic Infrastructure';

            return (
              <div
                key={p.id}
                className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-all space-y-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant">
                      {p.proposal?.problem?.category || 'CIVIC'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-container/20 text-primary">
                      {p.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-on-surface font-headline leading-snug">
                    {p.title}
                  </h3>

                  <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    Target: {probTitle}
                  </p>

                  <div className="mt-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-on-surface-variant">Milestones Achieved: <strong>{done}/{total}</strong></span>
                      <span className="font-bold text-primary">{pct}% Complete</span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1">
                      <span>Funded Escrow: <strong className="text-on-surface">₹{budgetInLakhs}L</strong></span>
                      <span>Smart Tranche Release</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/university/projects/${p.id}/milestones`}
                    className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary font-semibold text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    Manage & Certify Milestones
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
