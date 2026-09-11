import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { problemsApi } from '../../api/problems.api';
import type { ProblemCategory } from '../../types';

const CATEGORIES: { value: ProblemCategory; label: string }[] = [
  { value: 'WATER_SANITATION', label: 'Water & Sanitation' },
  { value: 'EDUCATION',        label: 'Education' },
  { value: 'HEALTHCARE',       label: 'Healthcare' },
  { value: 'AGRICULTURE',      label: 'Agriculture' },
  { value: 'ENVIRONMENT',      label: 'Environment' },
  { value: 'INFRASTRUCTURE',   label: 'Infrastructure' },
  { value: 'ENERGY',           label: 'Energy' },
  { value: 'OTHER',            label: 'Other' },
];

interface FormState {
  title: string;
  description: string;
  category: ProblemCategory;
  address: string;
  district: string;
  state: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): FieldErrors {
  const e: FieldErrors = {};
  if (!f.title.trim() || f.title.trim().length < 10) e.title = 'Title must be at least 10 characters.';
  if (!f.description.trim() || f.description.trim().length < 30) e.description = 'Please describe the problem in at least 30 characters.';
  if (!f.address.trim()) e.address = 'Street address is required.';
  if (!f.district.trim()) e.district = 'District is required.';
  if (!f.state.trim()) e.state = 'State is required.';
  return e;
}

const INITIAL: FormState = { title: '', description: '', category: 'OTHER', address: '', district: '', state: '' };

const ProblemSubmit: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [newProblemId, setNewProblemId] = useState<string | null>(null);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setServerError(null);
    setLoading(true);
    try {
      const problem = await problemsApi.create({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        address: form.address.trim(),
        district: form.district.trim(),
        state: form.state.trim(),
        latitude: 0,  // TODO: replace with map picker / geocoding
        longitude: 0,
      });
      setNewProblemId(problem.id);
      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={s.page}>
        <div style={s.successCard}>
          <div style={s.successIcon}>✓</div>
          <h1 style={s.successTitle}>Problem reported</h1>
          <p style={s.successDesc}>
            Your problem has been submitted and will be reviewed by our team. You'll receive updates as it progresses.
          </p>
          {newProblemId && (
            <p style={s.problemId}>Reference ID: <code>{newProblemId}</code></p>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <Link to="/citizen/problems" style={s.primaryBtn}>My Problems</Link>
            <Link to="/citizen/problems/submit" style={s.secondaryBtn} onClick={() => { setSubmitted(false); setForm(INITIAL); }}>Report Another</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.inner}>
          <Link to="/citizen" style={s.backLink}>← Dashboard</Link>
          <h1 style={s.pageTitle}>Report a Problem</h1>
          <p style={s.pageSubtitle}>Describe a local or social problem to connect it with university solutions</p>
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <Field id="ps-title" label="Problem Title" required error={errors.title}>
            <input id="ps-title" type="text" value={form.title} onChange={set('title')} placeholder="e.g. Contaminated drinking water in Ward 4" disabled={loading} style={{ ...s.input, borderColor: errors.title ? '#fca5a5' : '#d1d5db' }} />
          </Field>

          {/* Description */}
          <Field id="ps-desc" label="Description" required error={errors.description}>
            <textarea id="ps-desc" value={form.description} onChange={set('description')} rows={5} placeholder="Describe the problem in detail — who is affected, how long has it existed, what impact does it have?" disabled={loading} style={{ ...s.textarea, borderColor: errors.description ? '#fca5a5' : '#d1d5db' }} />
            <span style={s.charHint}>{form.description.length} / 1000 characters</span>
          </Field>

          {/* Category */}
          <Field id="ps-cat" label="Category" required>
            <select id="ps-cat" value={form.category} onChange={set('category')} disabled={loading} style={s.select}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>

          {/* Location */}
          <div style={s.locationGroup}>
            <Field id="ps-address" label="Street / Area Address" required error={errors.address}>
              <input id="ps-address" type="text" value={form.address} onChange={set('address')} placeholder="Ward 4, Rampur Village" disabled={loading} style={{ ...s.input, borderColor: errors.address ? '#fca5a5' : '#d1d5db' }} />
            </Field>
            <div style={s.locationRow}>
              <Field id="ps-district" label="District" required error={errors.district}>
                <input id="ps-district" type="text" value={form.district} onChange={set('district')} placeholder="Lucknow" disabled={loading} style={{ ...s.input, borderColor: errors.district ? '#fca5a5' : '#d1d5db' }} />
              </Field>
              <Field id="ps-state" label="State" required error={errors.state}>
                <input id="ps-state" type="text" value={form.state} onChange={set('state')} placeholder="Uttar Pradesh" disabled={loading} style={{ ...s.input, borderColor: errors.state ? '#fca5a5' : '#d1d5db' }} />
              </Field>
            </div>
          </div>

          {serverError && <p role="alert" style={s.serverError}>{serverError}</p>}

          <div style={s.actions}>
            <button type="submit" disabled={loading} style={{ ...s.primaryBtn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer', textDecoration: 'none', display: 'inline-block', border: 'none' }}>
              {loading ? 'Submitting…' : 'Submit Problem'}
            </button>
            <button type="button" onClick={() => navigate('/citizen')} disabled={loading} style={{ ...s.secondaryBtn, cursor: 'pointer', border: '1px solid #d1d5db', background: 'transparent' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Simple field wrapper
const Field: React.FC<{ id: string; label: string; required?: boolean; error?: string; children: React.ReactNode }> = ({ id, label, required, error, children }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <label htmlFor={id} style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
      {label} {required && <span style={{ color: '#b91c1c' }}>*</span>}
    </label>
    {children}
    {error && <p style={{ fontSize: '0.8125rem', color: '#b91c1c', marginTop: '0.25rem' }} role="alert">{error}</p>}
  </div>
);

const s: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'Inter, system-ui, sans-serif', color: '#111827', minHeight: '100%' },
  pageHeader: { background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '1.5rem' },
  inner: { maxWidth: '1100px', margin: '0 auto' },
  backLink: { display: 'inline-block', fontSize: '0.8125rem', color: '#1d4ed8', textDecoration: 'none', marginBottom: '0.75rem', fontWeight: 500 },
  pageTitle: { fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.01em' },
  pageSubtitle: { fontSize: '0.875rem', color: '#6b7280' },
  input: { display: 'block', width: '100%', boxSizing: 'border-box' as const, padding: '0.625rem 0.875rem', border: '1px solid', borderRadius: '3px', fontSize: '0.9375rem', color: '#111827', background: '#fafaf9', outline: 'none', fontFamily: 'inherit' },
  textarea: { display: 'block', width: '100%', boxSizing: 'border-box' as const, padding: '0.625rem 0.875rem', border: '1px solid', borderRadius: '3px', fontSize: '0.9375rem', color: '#111827', background: '#fafaf9', outline: 'none', fontFamily: 'inherit', resize: 'vertical' as const, lineHeight: 1.6 },
  select: { display: 'block', width: '100%', boxSizing: 'border-box' as const, padding: '0.625rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '3px', fontSize: '0.9375rem', color: '#111827', background: '#fafaf9', outline: 'none', fontFamily: 'inherit' },
  charHint: { fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem', display: 'block' },
  locationGroup: {},
  locationRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  serverError: { padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '3px', fontSize: '0.875rem', color: '#b91c1c', marginBottom: '1rem' },
  actions: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const },
  primaryBtn: { padding: '0.7rem 1.5rem', background: '#1d4ed8', color: '#ffffff', borderRadius: '3px', fontSize: '0.9375rem', fontWeight: 600, fontFamily: 'inherit' },
  secondaryBtn: { padding: '0.7rem 1.5rem', color: '#374151', borderRadius: '3px', fontSize: '0.9375rem', fontWeight: 500, fontFamily: 'inherit' },
  successCard: { maxWidth: '480px', margin: '4rem auto', background: '#ffffff', border: '1px solid #e5e7eb', borderTop: '4px solid #15803d', borderRadius: '4px', padding: '2.5rem 2rem', textAlign: 'center' as const },
  successIcon: { width: '48px', height: '48px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '50%', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: '#15803d', fontWeight: 700 },
  successTitle: { fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' },
  successDesc: { fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '1rem' },
  problemId: { fontSize: '0.8125rem', color: '#6b7280', marginBottom: '1.5rem' },
};

export default ProblemSubmit;
