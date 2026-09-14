import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsApi } from '../../api/projects.api';
import type { Project, Milestone } from '../../types';

const MilestoneTracker: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);

  const loadProject = async () => {
    if (!projectId) return;
    try {
      const p = await projectsApi.getById(projectId);
      setProject(p);
      setMilestones(p?.milestones ?? []);
    } catch (err) {
      console.error('Failed to load project details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const handleToggle = async (msId: string, currentStatus: boolean) => {
    if (!project) return;
    setSubmitting(msId);
    try {
      await projectsApi.updateMilestone(project.id, msId, !currentStatus);
      setMilestones((prev) =>
        prev.map((m) => (m.id === msId ? { ...m, isCompleted: !currentStatus } : m))
      );
      // Reload project state to reflect any project completion cascade
      loadProject();
    } catch (err: any) {
      alert(err.message || 'Failed to update milestone status');
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface p-space-lg flex items-center justify-center">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-2xl">refresh</span>
          <span className="font-body-md">Loading milestone audit telemetry…</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-surface p-space-lg">
        <div className="max-w-2xl mx-auto bg-surface-container-lowest p-space-xl rounded-2xl text-center border border-outline-variant/30">
          <p className="font-headline-sm text-on-surface mb-2">Project Not Found</p>
          <Link to="/university/projects" className="text-primary font-label-md hover:underline">
            Return to Project Directory
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = milestones.filter((m) => m.isCompleted).length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;
  const totalFunding = milestones.reduce((sum, m) => sum + m.fundingPercentage, 0);
  const earnedFunding = milestones
    .filter((m) => m.isCompleted)
    .reduce((sum, m) => sum + m.fundingPercentage, 0);

  return (
    <div className="min-h-screen bg-surface p-space-lg">
      <div className="max-w-4xl mx-auto flex flex-col gap-space-lg">

        {/* Header Breadcrumb */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-xs">
          <Link
            to="/university/projects"
            className="inline-flex items-center gap-1 text-primary font-label-md text-label-md hover:underline mb-space-xs"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Active Projects
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mt-1">
            <div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                {project.title}
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                {completedCount} of {milestones.length} milestones verified · Escrow Unlocked: {earnedFunding}% of {totalFunding}%
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full font-label-caps text-label-caps font-bold self-start md:self-auto ${
              progressPercent === 100
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-primary/10 text-primary border border-primary/20'
            }`}>
              {progressPercent === 100 ? 'PROJECT RESOLVED' : 'ACTIVE IN R&D'}
            </span>
          </div>
        </div>

        {/* Overall Progress Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-xs">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-lg text-label-lg text-on-surface font-semibold">
              Tranche Execution Velocity
            </span>
            <span className="font-headline-sm text-headline-sm font-bold text-primary">
              {progressPercent}% Complete
            </span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Milestone Cards */}
        <div className="flex flex-col gap-space-md">
          {milestones.map((m, idx) => {
            const isToggling = submitting === m.id;
            return (
              <div
                key={m.id}
                className={`bg-surface-container-lowest border rounded-2xl p-space-lg shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-space-md ${
                  m.isCompleted ? 'border-green-200 bg-green-50/10' : 'border-outline-variant/30'
                }`}
              >
                <div className="flex items-start gap-space-md">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-headline-sm font-bold ${
                      m.isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {m.isCompleted ? (
                      <span className="material-symbols-outlined text-[22px]">check</span>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-space-xs mb-1 flex-wrap">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        {m.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-label-caps text-[10px] font-bold">
                        Tranche: {m.fundingPercentage}% Grant
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-[13px]">
                      {m.description}
                    </p>
                    <div className="flex items-center gap-space-sm text-[11px] text-on-surface-variant/80 mt-2">
                      <span className="material-symbols-outlined text-[14px]">event</span>
                      Due: {new Date(m.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                {/* Status Toggle Button */}
                <button
                  disabled={isToggling}
                  onClick={() => handleToggle(m.id, m.isCompleted)}
                  className={`px-space-lg py-2.5 rounded-xl font-label-md text-label-md font-bold transition-all flex items-center gap-1.5 shrink-0 self-start md:self-auto ${
                    m.isCompleted
                      ? 'bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/40'
                      : 'bg-primary text-on-primary hover:bg-primary-container shadow-xs'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {m.isCompleted ? 'undo' : 'verified'}
                  </span>
                  {isToggling
                    ? 'Updating…'
                    : m.isCompleted
                    ? 'Mark Incomplete'
                    : 'Verify & Release Tranche'}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default MilestoneTracker;
