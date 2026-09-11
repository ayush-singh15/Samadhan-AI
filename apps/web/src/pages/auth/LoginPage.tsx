import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'Unable to sign in. Please try again.';
}

const DEMO_USERS: { role: UserRole; name: string; email: string; label: string; desc: string; icon: string }[] = [
  { role: 'CITIZEN',    name: 'Rajesh Sharma',      email: 'rajesh@ward42.in',     label: 'Citizen Innovator',     desc: 'Report & track civic problems',       icon: 'person' },
  { role: 'GOVERNMENT', name: 'Dr. Ananya Sharma',   email: 'ananya@gov.karnataka.in', label: 'Govt Admin Officer',  desc: 'Review, match & approve problems',     icon: 'account_balance' },
  { role: 'UNIVERSITY', name: 'Prof. Ravi Kumar',    email: 'ravi@iitk.ac.in',      label: 'University Researcher', desc: 'Submit proposals & track milestones',  icon: 'school' },
  { role: 'INDUSTRY',   name: 'Meera Joshi',         email: 'meera@tatacsrf.com',   label: 'CSR Impact Officer',    desc: 'Browse & fund civic projects',         icon: 'business' },
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
      const { user, token } = await authApi.login({ email: email.trim() });
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
    await new Promise((r) => setTimeout(r, 300));
    const mockUser = { id: `demo-${demo.role.toLowerCase()}`, name: demo.name, email: demo.email, role: demo.role };
    setUser(mockUser, 'demo_token_' + demo.role.toLowerCase());
    redirect(demo.role);
    setDemoLoading(null);
  };

  return (
    <div className="min-h-screen bg-surface font-body-md flex flex-col">

      {/* Minimal nav */}
      <header className="h-16 px-margin-desktop flex items-center border-b border-outline-variant/30">
        <Link to="/" className="flex items-center gap-space-sm">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-on-primary font-bold text-sm">TS</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary leading-tight">TriSetu</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-[10px]">Civic Mesh</span>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-space-sm">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-md text-label-md bg-surface-container text-primary border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live Production Mesh
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-margin-mobile py-space-2xl">
        <div className="w-full max-w-lg">

          {/* ─── Demo Quick Access ──────────────────────────────────────── */}
          <div className="mb-space-xl">
            <div className="text-center mb-space-lg">
              <p className="font-label-caps text-label-caps text-primary uppercase tracking-wider mb-space-xs">Quick Demo Access</p>
              <h1 className="font-headline-xl text-headline-xl text-on-surface">Select Your Role</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">Experience the full platform instantly — no backend required.</p>
            </div>
            <div className="grid grid-cols-2 gap-space-md">
              {DEMO_USERS.map((d) => (
                <button
                  key={d.role}
                  onClick={() => handleDemo(d)}
                  disabled={demoLoading !== null}
                  className={`flex flex-col items-start gap-space-xs p-space-md rounded-xl border-2 transition-all text-left ${
                    demoLoading === d.role
                      ? 'border-primary bg-primary/5 opacity-75'
                      : 'border-outline-variant hover:border-primary hover:bg-primary/5'
                  } ${demoLoading !== null && demoLoading !== d.role ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-space-xs w-full">
                    <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[20px]">{d.icon}</span>
                    </div>
                    {demoLoading === d.role && (
                      <span className="ml-auto font-label-caps text-label-caps text-primary uppercase text-[10px] animate-pulse">Loading…</span>
                    )}
                  </div>
                  <p className="font-label-lg text-label-lg text-on-surface font-semibold">{d.label}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ─── Separator ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-space-md mb-space-xl">
            <div className="flex-1 h-px bg-outline-variant/40" />
            <span className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap">or sign in with backend</span>
            <div className="flex-1 h-px bg-outline-variant/40" />
          </div>

          {/* ─── Backend sign-in form ───────────────────────────────────── */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-space-lg shadow-xs">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-space-xs">Sign In</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-lg">Connect to the live TriSetu production mesh.</p>

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="login-email" className="block font-label-lg text-label-lg text-on-surface mb-space-xs">
                Email address <span className="text-error">*</span>
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.ac.in"
                required
                autoComplete="email"
                disabled={loading}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-colors mb-space-md disabled:opacity-50"
              />

              {error && (
                <div role="alert" className="flex items-start gap-space-xs p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm mb-space-md">
                  <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isValid}
                className="w-full py-3 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm shadow-xs hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-space-xs"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    Signing in…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    Sign In to Civic Mesh
                  </>
                )}
              </button>
            </form>

            <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-space-md">
              New to TriSetu?{' '}
              <Link to="/register" className="text-primary hover:underline font-label-lg text-label-lg">Create an account</Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-space-lg mt-space-xl text-on-surface-variant">
            {[
              { icon: 'verified', text: 'NCIF Compliant' },
              { icon: 'security', text: 'RTI Transparent' },
              { icon: 'policy', text: 'MCA Sec. 135 Audited' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
                <span className="font-label-md text-label-md">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
