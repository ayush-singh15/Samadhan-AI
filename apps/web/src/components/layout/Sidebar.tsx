import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

  const citizenLinks = [
    { to: '/citizen/submit', label: 'Submit Problem', icon: '➕' },
    { to: '/citizen/my-submissions', label: 'My Submissions', icon: '📋' },
    { to: '/citizen/status-tracker', label: 'Status Tracker', icon: '📍' },
  ];

  const universityLinks = [
    { to: '/university/assigned-problems', label: 'Assigned Problems', icon: '🎯' },
    { to: '/university/proposals', label: 'R&D Proposals', icon: '📄' },
    { to: '/university/teams', label: 'Team Management', icon: '👥' },
  ];

  const industryLinks = [
    { to: '/industry/browse-proposals', label: 'Browse Proposals', icon: '🔍' },
    { to: '/industry/fund-project', label: 'CSR Funding', icon: '💰' },
    { to: '/industry/reports', label: 'Impact Reports', icon: '📊' },
  ];

  const govLinks = [
    { to: '/government/analytics', label: 'State Analytics', icon: '📈' },
  ];

  let links = citizenLinks;
  if (role === 'UNIVERSITY') links = universityLinks;
  if (role === 'INDUSTRY') links = industryLinks;
  if (role === 'GOVERNMENT') links = govLinks;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 shrink-0 hidden md:block">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-3">
        {role} Navigation
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
