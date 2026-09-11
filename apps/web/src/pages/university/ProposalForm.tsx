import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { problemsApi } from '../../api/problems.api';
import type { Problem, ProblemCategory } from '../../types';

interface FormState {
  title: string;
  abstract: string;
  budgetRequired: string;
  timelineMonths: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): FieldErrors {
  const e: FieldErrors = {};
  if (!f.title.trim() || f.title.trim().length < 10) e.title = 'Title must be at least 10 characters.';
  if (!f.abstract.trim() || f.abstract.trim().length < 50) e.abstract = 'Abstract must be at least 50 characters.';
  if (!f.budgetRequired || isNaN(Number(f.budgetRequired)) || Number(f.budgetRequired) <= 0) e.budgetRequired = 'Enter a valid budget amount.';
  if (!f.timelineMonths || isNaN(Number(f.timelineMonths)) || Number(f.timelineMonths) < 1) e.timelineMonths = 'Enter a valid number of months.';
  return e;
}

const ProposalForm: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [form, setForm] = useState<FormState>({ title: '', abstract: '', budgetRequired: '', timelineMonths: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (problemId) problemsApi.getById(problemId).then(setProblem).catch(() => null);
  }, [problemId]);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitError(null);
    setLoading(true);
    try {
      // TODO: call POST /api/v1/proposals
      // Payload: { problemId, title, abstract, budgetRequired: Number, timelineMonths: Number }
      // This endpoint is not yet implemented in the backend.
      await new Promise((r) => setTimeout(r, 800));
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={s.page}>
        <div style={s.successCard}>
          <div style={s.successIcon}>✓</div>
          <h1 style={s.successTitle}>Proposal submitted</h1>
          <p style={s.successDesc}>Your solution proposal has been submitted for admin review. You will be notified once it is reviewed.</p>
          <button onClick={() => navigate('/university')} style={s.primaryBtn}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.inner}>
          <Link to="/university/problems" style={s.backLink}>← Back to problems</Link>
          <h1 style={s.pageTitle}>Submit Solution Proposal</h1>
          {problem && <p style={s.pageSubtitle}>For: <strong>{problem.title}</strong> · {problem.district}, {problem.state}</p>}
        </div>
      </div>

      <div style={s.content}>
        <div style={s.notice}>
          <strong>⚠ Note:</strong> The proposal submission endpoint is not yet active in the backend. This form will not save real data yet.
        </div>

        <form onSubmit={handleSubmit} noValidate style={s.form}>
          <Field id="pf-title" label="Proposal Title" required error={errors.title}>
            <input id="pf-title" type="text" value={form.title} onChange={set('title')} placeholder="A concise name for your solution" disabled={loading} style={{ ...s.input, borderColor: errors.title ? '#fca5a5' : '#d1d5db' }} />
          </Field>

          <Field id="pf-abstract" label="Abstract / Approach" required error={errors.abstract}>
            <textarea id="pf-abstract" value={form.abstract} onChange={set('abstract')} rows={6} placeholder="Describe your technical approach, methodology, and expected outcomes…" disabled={loading} style={{ ...s.textarea, borderColor: errors.abstract ? '#fca5a5' : '#d1d5db' }} />
            <span style={s.hint}>{form.abstract.length} characters</span>
          </Field>

          <div style={s.twoCol}>
            <Field id="pf-budget" label="Budget Required (₹)" required error={errors.budgetRequired}>
              <input id="pf-budget" type="number" min="1" value={form.budgetRequired} onChange={set('budgetRequired')} placeholder="1500000" disabled={loading} style={{ ...s.input, borderColor: errors.budgetRequired ? '#fca5a5' : '#d1d5db' }} />
            </Field>
            <Field id="pf-months" label="Timeline (months)" required error={errors.timelineMonths}>
              <input id="pf-months" type="number" min="1" max="60" value={form.timelineMonths} onChange={set('timelineMonths')} placeholder="12" disabled={loading} style={{ ...s.input, borderColor: errors.timelineMonths ? '#fca5a5' : '#d1d5db' }} />
            </Field>
          </div>

          {submitError && <p role="alert" style={s.serverError}>{submitError}</p>}

          <div style={s.actions}>
            <button type="submit" disabled={loading} style={{ ...s.primaryBtn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer', border: 'none' }}>
              {loading ? 'Submitting…' : 'Submit Proposal'}
            </button>
            <button type="button" onClick={() => navigate('/university/problems')} disabled={loading} style={s.secondaryBtn}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field: React.FC<{ id: string; label: string; required?: boolean; error?: string; children: React.ReactNode }> = ({ id, label, required, error, children }) => (
  <div style={{ marginBottom: '0' }}>
    <label htmlFor={id} style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
      {label} {required && <span style={{ color: '#b91c1c' }}>*</span>}
    </label>
    {children}
    {error && <p style={{ fontSize: '0.8125rem', color: '#b91c1c', marginTop: '0.25rem' }} role="alert">{error}</p>}
  </div>
);

const s: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'Inter, system-ui, sans-serif', color: '#111827', minHeight: '100%' },
  pageHeader: { background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '1.5rem' },
  inner: { maxWidth: '720px', margin: '0 auto' },
  backLink: { display: 'inline-block', fontSize: '0.8125rem', color: '#1d4ed8', textDecoration: 'none', marginBottom: '0.75rem', fontWeight: 500 },
  pageTitle: { fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.01em' },
  pageSubtitle: { fontSize: '0.875rem', color: '#6b7280' },
  content: { maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem' },
  notice: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#92400e', marginBottom: '1.5rem', lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '1.25rem' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  input: { display: 'block', width: '100%', boxSizing: 'border-box' as const, padding: '0.625rem 0.875rem', border: '1px solid', borderRadius: '3px', fontSize: '0.9375rem', color: '#111827', background: '#fafaf9', outline: 'none', fontFamily: 'inherit' },
  textarea: { display: 'block', width: '100%', boxSizing: 'border-box' as const, padding: '0.625rem 0.875rem', border: '1px solid', borderRadius: '3px', fontSize: '0.9375rem', color: '#111827', background: '#fafaf9', outline: 'none', fontFamily: 'inherit', resize: 'vertical' as const, lineHeight: 1.6 },
  hint: { fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginTop: '0.25rem' },
  serverError: { padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '3px', fontSize: '0.875rem', color: '#b91c1c' },
  actions: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const },
  primaryBtn: { padding: '0.7rem 1.5rem', background: '#1d4ed8', color: '#fff', borderRadius: '3px', fontSize: '0.9375rem', fontWeight: 600, fontFamily: 'inherit', display: 'inline-block', textDecoration: 'none', cursor: 'pointer' },
  secondaryBtn: { padding: '0.7rem 1.5rem', background: 'transparent', color: '#374151', border: '1px solid #d1d5db', borderRadius: '3px', fontSize: '0.9375rem', cursor: 'pointer', fontFamily: 'inherit' },
  successCard: { maxWidth: '480px', margin: '4rem auto', background: '#fff', border: '1px solid #e5e7eb', borderTop: '4px solid #15803d', borderRadius: '4px', padding: '2.5rem 2rem', textAlign: 'center' as const },
  successIcon: { width: '48px', height: '48px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '50%', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: '#15803d', fontWeight: 700 },
  successTitle: { fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' },
  successDesc: { fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '1.5rem' },
};

export default ProposalForm;
