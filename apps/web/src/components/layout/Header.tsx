import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ---- Navigation config per role ----------------------------

type NavItem = { label: string; to: string };

const NAV_CONFIG: Record<string, NavItem[]> = {
  CITIZEN: [
    { label: 'Dashboard', to: '/citizen/dashboard' },
    { label: 'My Problems', to: '/citizen/problems' },
    { label: 'Report Problem', to: '/citizen/problems/submit' },
  ],
  UNIVERSITY: [
    { label: 'Dashboard', to: '/university/dashboard' },
    { label: 'Problems', to: '/university/problems' },
    { label: 'Projects', to: '/university/projects' },
  ],
  GOVERNMENT: [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Problems', to: '/admin/problems' },
    { label: 'Matching', to: '/admin/matching' },
    { label: 'Proposals', to: '/admin/proposals' },
  ],
  INDUSTRY: [
    { label: 'Dashboard', to: '/industry/dashboard' },
    { label: 'Opportunities', to: '/industry/proposals' },
  ],
};

const PUBLIC_NAV: NavItem[] = [
  { label: 'How it Works', to: '/#how-it-works' },
  { label: 'About', to: '/about' },
];

// ---- Component ---------------------------------------------

const Header: React.FC = () => {
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems =
    isAuthenticated && role ? NAV_CONFIG[role] ?? [] : PUBLIC_NAV;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <header style={s.header}>
      <div style={s.inner}>
        {/* Wordmark */}
        <Link
          to="/"
          style={s.wordmark}
          onClick={() => setMenuOpen(false)}
          id="header-logo"
        >
          <span style={s.wordmarkTri}>Tri</span>
          <span style={s.wordmarkSetu}>Setu</span>
        </Link>

        {/* Desktop Nav */}
        <nav style={s.desktopNav} aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                ...s.navLink,
                ...(isActive ? s.navLinkActive : {}),
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop auth area */}
        <div style={s.authArea}>
          {isAuthenticated ? (
            <>
              <span style={s.userName}>{user?.name}</span>
              <button
                onClick={handleLogout}
                style={s.logoutBtn}
                id="header-logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.loginLink} id="header-login">
                Sign In
              </Link>
              <Link to="/register" style={s.registerBtn} id="header-register">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          style={s.hamburger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span style={{ ...s.hamburgerBar, ...(menuOpen ? s.barTop : {}) }} />
          <span style={{ ...s.hamburgerBar, opacity: menuOpen ? 0 : 1 }} />
          <span style={{ ...s.hamburgerBar, ...(menuOpen ? s.barBot : {}) }} />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div style={s.mobileMenu} role="dialog" aria-label="Mobile navigation">
          <nav>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                style={s.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div style={s.mobileDivider} />
          {isAuthenticated ? (
            <>
              <p style={s.mobileUserName}>{user?.name}</p>
              <button
                onClick={handleLogout}
                style={s.mobileLogoutBtn}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={s.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{ ...s.mobileNavLink, fontWeight: 600, color: '#1d4ed8' }}
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

// ---- Styles ------------------------------------------------

const s: Record<string, React.CSSProperties> = {
  header: {
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.25rem',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  wordmark: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'baseline',
    gap: '1px',
    flexShrink: 0,
  },
  wordmarkTri: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#1d4ed8',
    letterSpacing: '-0.02em',
  },
  wordmarkSetu: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#111827',
    letterSpacing: '-0.02em',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.125rem',
    flex: 1,
    // Hidden on mobile via media queries — handled with @media in index.css
  },
  navLink: {
    textDecoration: 'none',
    color: '#4b5563',
    fontSize: '0.875rem',
    fontWeight: 500,
    padding: '0.375rem 0.625rem',
    borderRadius: '3px',
    whiteSpace: 'nowrap',
  },
  navLinkActive: {
    color: '#1d4ed8',
    background: '#eff6ff',
  },
  authArea: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  userName: {
    fontSize: '0.8125rem',
    color: '#6b7280',
    fontWeight: 500,
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  loginLink: {
    textDecoration: 'none',
    color: '#374151',
    fontSize: '0.875rem',
    fontWeight: 500,
    padding: '0.375rem 0.75rem',
  },
  registerBtn: {
    display: 'inline-block',
    padding: '0.375rem 1rem',
    background: '#1d4ed8',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '3px',
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  logoutBtn: {
    display: 'inline-block',
    padding: '0.375rem 1rem',
    background: 'transparent',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '3px',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  // Hamburger
  hamburger: {
    display: 'none',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    gap: '5px',
    width: '36px',
    height: '36px',
    padding: '6px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    marginLeft: 'auto',
    flexShrink: 0,
  },
  hamburgerBar: {
    display: 'block',
    width: '100%',
    height: '2px',
    background: '#374151',
    borderRadius: '1px',
    transition: 'transform 0.2s, opacity 0.2s',
  },
  barTop: { transform: 'translateY(7px) rotate(45deg)' },
  barBot: { transform: 'translateY(-7px) rotate(-45deg)' },
  // Mobile menu
  mobileMenu: {
    background: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    padding: '1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  mobileNavLink: {
    display: 'block',
    textDecoration: 'none',
    color: '#374151',
    fontSize: '0.9375rem',
    fontWeight: 500,
    padding: '0.75rem 0.5rem',
    borderBottom: '1px solid #f3f4f6',
  },
  mobileDivider: {
    borderTop: '1px solid #e5e7eb',
    margin: '0.5rem 0',
  },
  mobileUserName: {
    fontSize: '0.8125rem',
    color: '#6b7280',
    padding: '0.5rem',
    margin: 0,
  },
  mobileLogoutBtn: {
    padding: '0.75rem',
    background: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '3px',
    color: '#374151',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left' as const,
    fontFamily: 'inherit',
    width: '100%',
    marginTop: '0.25rem',
  },
};

export default Header;
