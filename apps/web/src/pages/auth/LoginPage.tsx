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
  { role: 'CITIZEN',    name: 'Ramesh Kumar',       email: 'citizen@samadhan.gov.in',     label: 'Citizen Innovator',     desc: 'Report & track civic problems',       icon: 'person' },
  { role: 'GOVERNMENT', name: 'Smt. Priya Nair',    email: 'admin@samadhan.gov.in',   label: 'Govt Admin Officer',  desc: 'Review, match & approve problems',     icon: 'account_balance' },
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

  // Tabs: 'otp' | 'demo' | 'password'
  const [activeTab, setActiveTab] = useState<'otp' | 'demo' | 'password'>('otp');

  // OTP State
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Password Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState<UserRole | null>(null);

  const redirect = (role: UserRole) => navigate(from ?? ROLE_HOME[role], { replace: true });

  // Countdown timer effect
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Request OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || identifier.trim().length < 4) {
      setError('Please enter a valid 10-digit mobile number or email.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.sendOtp(identifier.trim(), 'CITIZEN');
      setOtpSent(true);
      setSuccessMsg(res.message);
      if (res.otpPreview) {
        setOtpPreview(res.otpPreview);
      }
      setCountdown(60); // 60s cooldown
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP received.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { user, token } = await authApi.verifyOtp(identifier.trim(), otp.trim());
      setUser(user, token);
      redirect((user.role as UserRole) || 'CITIZEN');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Password Login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setError(null);
    setLoading(true);
    try {
      const { user, token } = await authApi.login({ email: email.trim(), password: password });
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
      const { user, token } = await authApi.login({ email: demo.email, password: 'Password@123' });
      setUser(user, token);
      redirect(user.role as UserRole);
    } catch {
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

          {/* Heading */}
          <div className="text-center mb-space-lg">
            <p className="font-label-caps text-label-caps text-primary uppercase tracking-wider mb-space-xs">
              National Civic Infrastructure
            </p>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">
              Sign In to Samadhan AI
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
              Secure authentication via Real OTP, Aadhaar/Mobile or Quad-Helix Role.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-surface-container-low p-1.5 rounded-2xl mb-space-lg border border-outline-variant/30">
            <button
              onClick={() => { setActiveTab('otp'); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl font-label-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'otp'
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">sms</span>
              OTP Login
            </button>
            <button
              onClick={() => { setActiveTab('demo'); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl font-label-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'demo'
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">badge</span>
              Official Roles
            </button>
            <button
              onClick={() => { setActiveTab('password'); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl font-label-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'password'
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">key</span>
              Password
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-space-md p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-error text-[18px]">error</span>
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-space-md p-space-sm rounded-lg bg-primary/10 text-primary border border-primary/20 font-body-sm text-body-sm flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              {successMsg}
            </div>
          )}

          {/* ─── TAB 1: OTP AUTHENTICATION ────────────────────────── */}
          {activeTab === 'otp' && (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-lg shadow-sm">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="flex flex-col gap-space-md">
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1.5">
                      Mobile Number or Official Email
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[20px]">
                        phone_android
                      </span>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. 9876543210 or citizen@nic.in"
                        required
                        className="w-full pl-11 pr-space-md py-3 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <p className="font-body-xs text-body-xs text-on-surface-variant mt-1.5">
                      We will send a cryptographically secure 6-digit OTP valid for 5 minutes.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !identifier.trim()}
                    className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-headline-sm hover:bg-primary-container transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                    {loading ? 'Generating OTP…' : 'Send 6-Digit OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-space-md">
                  {otpPreview && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-900 dark:text-amber-200 text-sm flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-amber-600 text-[18px]">lock</span>
                        Security OTP Preview: <strong className="tracking-widest font-mono text-base">{otpPreview}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setOtp(otpPreview)}
                        className="px-2 py-0.5 text-xs bg-amber-600 text-white rounded font-medium hover:bg-amber-700"
                      >
                        Autofill
                      </button>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                        Enter 6-Digit Verification Code
                      </label>
                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); setOtp(''); }}
                        className="text-primary text-xs font-semibold hover:underline"
                      >
                        Change Number
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      autoFocus
                      required
                      className="w-full text-center tracking-[0.75em] text-2xl font-mono py-3 rounded-xl border-2 border-primary bg-surface text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-2 focus:ring-primary font-bold"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span>Sent to: <strong>{identifier}</strong></span>
                    {countdown > 0 ? (
                      <span className="text-on-surface-variant">Resend in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-primary font-semibold hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-headline-sm hover:bg-primary-container transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                    {loading ? 'Verifying OTP…' : 'Verify & Enter Portal'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ─── TAB 2: OFFICIAL DEMO ACCOUNTS ───────────────────── */}
          {activeTab === 'demo' && (
            <div className="grid grid-cols-2 gap-space-md">
              {DEMO_USERS.map((d) => (
                <button
                  key={d.role}
                  onClick={() => handleDemo(d)}
                  disabled={demoLoading !== null}
                  className={`flex flex-col items-start gap-space-xs p-space-md rounded-2xl border-2 transition-all text-left bg-surface-container-lowest ${
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
          )}

          {/* ─── TAB 3: PASSWORD LOGIN ───────────────────────────── */}
          {activeTab === 'password' && (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-lg shadow-sm">
              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-space-md">
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
                    required
                    className="w-full px-space-md py-2.5 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!email || !password || loading}
                  className="w-full py-3 rounded-xl bg-primary text-on-primary font-headline-sm hover:bg-primary-container transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-space-xs"
                >
                  {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  {loading ? 'Authenticating…' : 'Sign In with Password'}
                </button>
              </form>
            </div>
          )}

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
