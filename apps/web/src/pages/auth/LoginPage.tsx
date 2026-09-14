import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/ui/BrandLogo';
import type { UserRole } from '../../types';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'Unable to sign in. Please try again.';
}

const DEMO_USERS: { role: UserRole; name: string; email: string; label: string; desc: string; icon: string }[] = [
  { role: 'CITIZEN',    name: 'Ramesh Kumar',       email: 'citizen@trisetu.in',     label: 'Citizen Innovator',     desc: 'Report & track civic problems',       icon: 'person' },
  { role: 'GOVERNMENT', name: 'Smt. Priya Nair',    email: 'admin@trisetu.gov.in',   label: 'Govt Admin Officer',  desc: 'Review, match & approve problems',     icon: 'account_balance' },
  { role: 'UNIVERSITY', name: 'Prof. Alok Sharma',   email: 'prof.sharma@iitk.ac.in', label: 'University Researcher', desc: 'Submit proposals & track milestones',  icon: 'school' },
  { role: 'INDUSTRY',   name: 'Vikramaditya Roy',   email: 'csr.head@tatatrusts.org',label: 'CSR Impact Officer',    desc: 'Browse & fund civic projects',         icon: 'business' },
];

const ROLE_HOME: Record<UserRole, string> = {
  CITIZEN: '/citizen', GOVERNMENT: '/admin', ADMIN: '/admin', UNIVERSITY: '/university', INDUSTRY: '/industry',
};

const LoginPage: React.FC = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState<UserRole | null>(null);

  const isValid = email.trim().length > 0 && email.includes('@');

  const redirect = (role: UserRole) => navigate(from ?? ROLE_HOME[role], { replace: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setError(null);
    setLoading(true);
    try {
      const { user, token } = await authApi.login({ email: email.trim(), password: password || 'Password@123' });
      setUser(user, token);
      redirect(user.role as UserRole);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (demo: typeof DEMO_USERS[number]) => {
    setDemoLoading(demo.role);
    try {
      // Attempt live login with default seed password
      const { user, token } = await authApi.login({ email: demo.email, password: 'Password@123' });
      setUser(user, token);
      redirect(user.role as UserRole);
    } catch {
      // Instant fallback if offline
      const mockUser = { id: `demo-${demo.role.toLowerCase()}`, name: demo.name, email: demo.email, role: demo.role };
      setUser(mockUser, 'demo_token_' + demo.role.toLowerCase());
      redirect(demo.role);
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md flex flex-col">

      {/* Minimal nav */}
      <header className="h-16 px-margin-mobile md:px-margin-desktop flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-space-sm">
          <BrandLogo size="md" />
        </Link>
        <div className="flex items-center gap-space-sm">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-md text-label-md bg-surface-container text-primary border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live National Mesh
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-margin-mobile py-space-2xl">
        <div className="w-full max-w-lg">

          {/* ─── Demo Quick Access ──────────────────────────────────────── */}
          <div className="mb-space-xl">
            <div className="text-center mb-space-lg">
              <p className="font-label-caps text-label-caps text-primary uppercase tracking-wider mb-space-xs">Quad-Helix Role Access</p>
              <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">Select Your Workspace</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                Log in directly using pre-configured Quad-Helix credentials.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-space-md">
              {DEMO_USERS.map((d) => (
                <button
                  key={d.role}
                  onClick={() => handleDemo(d)}
                  disabled={demoLoading !== null}
                  className={`flex flex-col items-start gap-space-xs p-space-md rounded-xl border-2 transition-all text-left bg-surface-container-lowest ${
                    demoLoading === d.role
                      ? 'border-primary bg-primary/5 opacity-75'
                      : 'border-outline-variant/40 hover:border-primary hover:bg-primary/5 shadow-xs'
                  } ${demoLoading !== null && demoLoading !== d.role ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-space-xs w-full">
                    <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[20px]">{d.icon}</span>
                    </div>
                    {demoLoading === d.role && (
                      <span className="ml-auto font-label-caps text-label-caps text-primary uppercase text-[10px] animate-pulse">Entering…</span>
                    )}
                  </div>
                  <p className="font-label-lg text-label-lg text-on-surface font-semibold">{d.label}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">{d.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ─── Separator ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-space-md mb-space-xl">
            <div className="flex-1 h-px bg-outline-variant/40" />
            <span className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap">or sign in with custom account</span>
            <div className="flex-1 h-px bg-outline-variant/40" />
          </div>

          {/* ─── Backend sign-in form ───────────────────────────────────── */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-space-lg shadow-xs">
            {error && (
              <div className="mb-space-md p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-error text-[18px]">error</span>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. resident@ward4.in"
                  required
                  className="w-full px-space-md py-2.5 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-space-md py-2.5 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full py-3 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm hover:bg-primary-container transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-space-xs"
              >
                {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                {loading ? 'Authenticating…' : 'Sign In to Samadhan AI'}
              </button>
            </form>
          </div>

          <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-space-md">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create citizen registration
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
