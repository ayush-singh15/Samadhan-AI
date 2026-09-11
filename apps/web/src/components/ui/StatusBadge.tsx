import React from 'react';
import type { ProblemStatus } from '../../types';

// Covers ProblemStatus from Prisma + proposal/project string statuses
type StatusInput = ProblemStatus | string;

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string }> = {
  // Problem statuses (Prisma)
  SUBMITTED:              { label: 'Submitted',            color: '#374151', bg: '#f3f4f6', border: '#d1d5db' },
  AI_CATEGORIZED:         { label: 'AI Categorised',       color: '#92400e', bg: '#fffbeb', border: '#fde68a' },
  ASSIGNED_TO_UNIVERSITY: { label: 'Assigned',             color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' },
  PROPOSAL_SUBMITTED:     { label: 'Proposal Submitted',   color: '#065f46', bg: '#ecfdf5', border: '#a7f3d0' },
  FUNDING_APPROVED:       { label: 'Funding Approved',     color: '#14532d', bg: '#f0fdf4', border: '#86efac' },
  IN_PROGRESS:            { label: 'In Progress',          color: '#065f46', bg: '#ecfdf5', border: '#a7f3d0' },
  RESOLVED:               { label: 'Resolved',             color: '#1e293b', bg: '#e2e8f0', border: '#cbd5e1' },
  REJECTED:               { label: 'Rejected',             color: '#991b1b', bg: '#fef2f2', border: '#fecaca' },
  // Proposal statuses
  APPROVED:               { label: 'Approved',             color: '#166534', bg: '#f0fdf4', border: '#bbf7d0' },
  PENDING:                { label: 'Pending',              color: '#374151', bg: '#f3f4f6', border: '#d1d5db' },
  // Project statuses
  IN_DEVELOPMENT:         { label: 'In Development',       color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' },
  COMPLETED:              { label: 'Completed',            color: '#1e293b', bg: '#e2e8f0', border: '#cbd5e1' },
  ACTIVE:                 { label: 'Active',               color: '#065f46', bg: '#ecfdf5', border: '#a7f3d0' },
  // Milestone
  NOT_STARTED:            { label: 'Not Started',          color: '#374151', bg: '#f3f4f6', border: '#d1d5db' },
};

const DEFAULT = { label: '', color: '#374151', bg: '#f3f4f6', border: '#d1d5db' };

interface StatusBadgeProps {
  status: StatusInput;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const cfg = STATUS_MAP[status] ?? { ...DEFAULT, label: status };
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '0.75rem',
        fontWeight: 600,
        padding: '0.2rem 0.6rem',
        borderRadius: '3px',
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        background: cfg.bg,
        whiteSpace: 'nowrap',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
