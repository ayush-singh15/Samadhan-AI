import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../ui/BrandLogo';
import type { UserRole } from '../../types';

interface NavItem {
  icon: string;
  label: string;
  to: string;
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  CITIZEN: [
    { icon: 'grid_view',        label: 'Operations Desk',   to: '/citizen' },
    { icon: 'campaign',         label: 'My Problems',       to: '/citizen/problems' },
    { icon: 'add_circle',       label: 'Report Problem',    to: '/citizen/problems/submit' },
    { icon: 'feedback',         label: 'Civic Projects',    to: '/citizen/problems' },
  ],
  GOVERNMENT: [
    { icon: 'grid_view',        label: 'Operations Desk',   to: '/admin' },
    { icon: 'account_balance',  label: 'Problem Review',    to: '/admin/problems' },
    { icon: 'auto_awesome',     label: 'AI Matching',       to: '/admin/matching' },
    { icon: 'fact_check',       label: 'Proposals',         to: '/admin/proposals' },
    { icon: 'bar_chart',        label: 'Public Ledger',     to: '/admin' },
  ],
  ADMIN: [
    { icon: 'grid_view',        label: 'Operations Desk',   to: '/admin' },
    { icon: 'account_balance',  label: 'Problem Review',    to: '/admin/problems' },
    { icon: 'auto_awesome',     label: 'AI Matching',       to: '/admin/matching' },
    { icon: 'fact_check',       label: 'Proposals',         to: '/admin/proposals' },
    { icon: 'bar_chart',        label: 'Public Ledger',     to: '/admin' },
  ],
  UNIVERSITY: [
    { icon: 'grid_view',        label: 'Operations Desk',   to: '/university' },
    { icon: 'travel_explore',   label: 'Civic Challenges',  to: '/university/problems' },
    { icon: 'account_balance',  label: 'Civic Projects',    to: '/university/projects' },
    { icon: 'award_star',       label: 'Challenge Grants',  to: '/university' },
    { icon: 'school',           label: 'R&D Hub',           to: '/university' },
  ],
  INDUSTRY: [
    { icon: 'grid_view',        label: 'Operations Desk',   to: '/industry' },
    { icon: 'verified',         label: 'Browse Projects',   to: '/industry/proposals' },
    { icon: 'account_balance_wallet', label: 'CSR Compliance', to: '/industry' },
    { icon: 'fact_check',       label: 'Public Ledger',     to: '/industry' },
  ],
};

const ROLE_LABEL: Record<UserRole, string> = {
  CITIZEN:    'Citizen Innovator',
  GOVERNMENT: 'Government Authority',
  ADMIN:      'Admin Officer',
  UNIVERSITY: 'University Researcher',
  INDUSTRY:   'CSR Impact Officer',
};

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const role = (user?.role as UserRole) ?? 'CITIZEN';
  const navItems = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.CITIZEN;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md">

      {/* ─── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={`fixed left-0 top-0 h-full ${collapsed ? 'w-16' : 'w-64'} bg-surface-container-low border-r border-outline-variant/30 z-50 flex flex-col justify-between transition-all duration-200`}>
        <div className="flex flex-col min-h-0">
          {/* Logo */}
          <div className={`h-16 px-space-base flex items-center gap-space-sm border-b border-outline-variant/30 ${collapsed ? 'justify-center px-2' : ''}`}>
            {collapsed ? (
              <BrandLogo variant="icon" size="sm" />
            ) : (
              <BrandLogo variant="full" size="sm" />
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`ml-auto text-on-surface-variant hover:text-on-surface p-0.5 rounded transition-colors ${collapsed ? 'mx-auto ml-0' : ''}`}
              aria-label="Toggle sidebar"
            >
              <span className="material-symbols-outlined text-[18px]">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
            </button>
          </div>

          {/* Operating Role */}
          {!collapsed && (
            <div className="px-space-base py-space-sm">
              <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-space-xs flex flex-col gap-space-2xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant px-1 uppercase text-[10px]">Operating Role</span>
                <div className="w-full bg-surface-container-low text-on-surface font-label-md text-label-md rounded-lg px-2 py-1.5 border border-outline-variant/40 truncate">
                  {ROLE_LABEL[role]}
                </div>
              </div>
            </div>
          )}

          {/* Nav items */}
          <nav className={`flex flex-col gap-space-2xs px-space-base mt-space-xs flex-1 overflow-y-auto ${collapsed ? 'px-2' : ''}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to + item.label}
                to={item.to}
                end={item.to.split('/').length <= 2}
                className={({ isActive }) =>
                  `flex items-center gap-space-sm py-2.5 rounded-xl transition-all ${collapsed ? 'justify-center px-2' : 'px-space-md'} ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-headline-sm shadow-xs'
                      : 'text-on-surface-variant font-label-lg text-label-lg hover:bg-surface-container-high hover:text-on-surface'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="material-symbols-outlined text-[22px] flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom: logout + trust network */}
        <div className={`border-t border-outline-variant/30 ${collapsed ? 'p-2' : 'p-space-base'}`}>
          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-space-sm py-2 rounded-xl text-error hover:bg-error-container/30 transition-colors w-full mb-space-sm ${collapsed ? 'justify-center px-2' : 'px-space-md'}`}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <span className="material-symbols-outlined text-[20px] flex-shrink-0">logout</span>
            {!collapsed && <span className="font-label-lg text-label-lg">Sign Out</span>}
          </button>

          {/* Trust Network */}
          {!collapsed && (
            <div className="p-space-sm rounded-xl bg-surface-container-high/60 border border-outline-variant/40">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">policy</span>
                <span className="font-label-caps text-label-caps text-primary uppercase text-[10px]">Trust Network</span>
              </div>
              <p className="font-code text-code text-on-surface-variant mt-1 text-[11px]">Node ID: IND-710-DEL</p>
            </div>
          )}
        </div>
      </aside>

      {/* ─── Main area ───────────────────────────────────────────────────── */}
      <div className={`${collapsed ? 'pl-16' : 'pl-64'} transition-all duration-200`}>

        {/* ─── Top Header bar ───────────────────────────────────────────── */}
        <header className={`fixed top-0 ${collapsed ? 'left-16' : 'left-64'} right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/30 z-40 flex items-center justify-between px-space-lg transition-all duration-200`}>
          <div className="flex items-center gap-space-sm">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-md text-label-md bg-surface-container text-primary border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live Production Mesh
            </span>
          </div>
          <div className="flex items-center gap-space-md">
            {/* Bell */}
            <div className="relative">
              <button aria-label="Notifications" className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest" />
              </button>
            </div>
            <div className="h-6 w-px bg-outline-variant/40" />
            {/* User */}
            <div className="flex items-center gap-space-sm text-on-surface">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
              <div className="hidden md:flex flex-col">
                <span className="font-label-md text-label-md text-on-surface leading-tight">{user?.name ?? 'User'}</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">{ROLE_LABEL[role]}</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
            </div>
          </div>
        </header>

        {/* ─── Page content ─────────────────────────────────────────────── */}
        <main className="relative pt-16 bg-surface min-h-screen px-space-lg py-space-xl">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
