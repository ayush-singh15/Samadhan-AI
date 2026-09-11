import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'CITIZEN',    label: 'Citizen',             description: 'Report local problems' },
  { value: 'UNIVERSITY', label: 'University / College', description: 'Submit solutions & track projects' },
  { value: 'INDUSTRY',   label: 'Industry / CSR',       description: 'Fund and support projects' },
];

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'Registration failed. Please try again.';
}

const RegisterPage: React.FC = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', role: 'CITIZEN' as UserRole });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = form.name.trim().length > 1 && form.email.includes('@') && !!form.role;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setError(null);
    setLoading(true);
    try {
      const { user, token } = await authApi.register({
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      });
      setUser(user, token);
      switch (user.role) {
        case 'GOVERNMENT':
        case 'ADMIN':
          navigate('/admin', { replace: true });
          break;
        case 'UNIVERSITY':
          navigate('/university', { replace: true });
          break;
        case 'INDUSTRY':
          navigate('/industry', { replace: true });
          break;
        default:
          navigate('/citizen', { replace: true });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoRow}>
          <span style={s.tri}>Tri</span><span style={s.setu}>Setu</span>
        </div>
        <h1 style={s.heading}>Create account</h1>
        <p style={s.sub}>Join the Societal Innovation Collaboration Platform</p>
        <hr style={s.divider} />

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div style={s.field}>
            <label htmlFor="reg-name" style={s.label}>Full name <span style={s.req}>*</span></label>
            <input
              id="reg-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your full name"
              required
              disabled={loading}
              style={s.input}
            />
          </div>

          {/* Email */}
          <div style={s.field}>
            <label htmlFor="reg-email" style={s.label}>Email address <span style={s.req}>*</span></label>
            <input
              id="reg-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@institution.ac.in"
              required
              autoComplete="email"
              disabled={loading}
              style={s.input}
            />
          </div>

          {/* Role */}
          <div style={s.field}>
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend style={s.label}>I am registering as <span style={s.req}>*</span></legend>
              <div style={s.roleList}>
                {ROLES.map((r) => (
                  <label
                    key={r.value}
                    style={{
                      ...s.roleOption,
                      borderColor: form.role === r.value ? '#1d4ed8' : '#d1d5db',
                      background: form.role === r.value ? '#eff6ff' : '#fff',
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={form.role === r.value}
                      onChange={() => setForm((f) => ({ ...f, role: r.value }))}
                      disabled={loading}
                      style={{ marginRight: '0.625rem', flexShrink: 0 }}
                    />
                    <span>
                      <strong style={{ fontSize: '0.875rem', color: '#111827' }}>{r.label}</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.125rem' }}>{r.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p style={s.roleNote}>
              Government / Admin accounts are created by the platform administrator.
            </p>
          </div>

          {error && <p role="alert" style={s.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading || !isValid}
            style={{ ...s.btn, opacity: loading || !isValid ? 0.55 : 1, cursor: loading || !isValid ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={s.foot}>
          Already have an account?{' '}
          <Link to="/login" style={s.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: 'Inter, system-ui, sans-serif' },
  card: { background: '#fff', border: '1px solid #d1d5db', borderTop: '4px solid #1d4ed8', borderRadius: '4px', padding: '2.5rem 2rem', width: '100%', maxWidth: '440px' },
  logoRow: { display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' },
  tri: { fontSize: '1.5rem', fontWeight: 800, color: '#1d4ed8', letterSpacing: '-0.03em' },
  setu: { fontSize: '1.5rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.03em' },
  heading: { fontSize: '1.125rem', fontWeight: 700, textAlign: 'center', color: '#111827', margin: '0 0 0.25rem', letterSpacing: '-0.01em' },
  sub: { fontSize: '0.8125rem', color: '#6b7280', textAlign: 'center', margin: '0 0 1.25rem' },
  divider: { border: 'none', borderTop: '1px solid #e5e7eb', margin: '0 0 1.5rem' },
  field: { marginBottom: '1.25rem' },
  label: { display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' },
  req: { color: '#b91c1c' },
  input: { display: 'block', width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '3px', fontSize: '0.9375rem', color: '#111827', background: '#fafaf9', outline: 'none', fontFamily: 'inherit' },
  roleList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  roleOption: { display: 'flex', alignItems: 'flex-start', padding: '0.75rem', border: '1.5px solid', borderRadius: '3px', cursor: 'pointer' },
  roleNote: { fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' },
  btn: { display: 'block', width: '100%', padding: '0.7rem', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1.25rem', fontFamily: 'inherit' },
  error: { fontSize: '0.8125rem', color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '3px', padding: '0.5rem 0.75rem', marginBottom: '0.75rem' },
  foot: { fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', margin: 0 },
  link: { color: '#1d4ed8', textDecoration: 'underline', fontWeight: 500 },
};

export default RegisterPage;
