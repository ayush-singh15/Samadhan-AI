import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { problemsApi } from '../../api/problems.api';
import type { Problem } from '../../types';
import { useEffect } from 'react';

const FeedbackPage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [helped, setHelped] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (problemId) {
      problemsApi.getById(problemId).then(setProblem).catch(() => null);
    }
  }, [problemId]);

  const isValid = rating > 0 && helped !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setError(null);
    setLoading(true);
    try {
      // TODO: call POST /api/v1/feedback { problemId, rating, comment, solutionHelped: helped }
      // This endpoint does not exist in the backend yet.
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
    } catch {
      setError('Unable to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={s.page}>
        <div style={{ ...s.content, textAlign: 'center' as const }}>
          <div style={s.successIcon}>✓</div>
          <h1 style={s.successTitle}>Thank you for your feedback</h1>
          <p style={s.successDesc}>Your feedback helps us measure the impact of solutions and improve the platform.</p>
          <button onClick={() => navigate('/citizen')} style={s.primaryBtn}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.inner}>
          <Link to={`/citizen/problems/${problemId}`} style={s.backLink}>← Back to problem</Link>
          <h1 style={s.pageTitle}>Submit Feedback</h1>
          {problem && <p style={s.pageSubtitle}>for: <strong>{problem.title}</strong></p>}
        </div>
      </div>

      <div style={s.content}>
        <form onSubmit={handleSubmit} noValidate style={s.form}>
          {/* Rating */}
          <fieldset style={s.fieldset}>
            <legend style={s.label}>How would you rate the solution? <span style={s.req}>*</span></legend>
            <div style={s.stars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} star${n > 1 ? 's' : ''}`} aria-pressed={rating >= n} style={{ ...s.starBtn, color: n <= rating ? '#f59e0b' : '#d1d5db' }}>★</button>
              ))}
            </div>
            {rating > 0 && <p style={s.ratingLabel}>{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}</p>}
          </fieldset>

          {/* Helped? */}
          <fieldset style={s.fieldset}>
            <legend style={s.label}>Did this solution help address the problem? <span style={s.req}>*</span></legend>
            <div style={s.radioGroup}>
              {[{ val: true, label: 'Yes, it helped' }, { val: false, label: 'Not significantly' }].map(({ val, label }) => (
                <label key={String(val)} style={s.radioLabel}>
                  <input type="radio" name="helped" checked={helped === val} onChange={() => setHelped(val)} style={{ marginRight: '0.5rem' }} />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Comment */}
          <div style={s.field}>
            <label htmlFor="fb-comment" style={s.label}>Additional comments <span style={s.optional}>(optional)</span></label>
            <textarea id="fb-comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Any additional thoughts about the solution's impact or quality…" rows={4} disabled={loading} style={s.textarea} />
          </div>

          {error && <p role="alert" style={s.errorMsg}>{error}</p>}

          <button type="submit" disabled={loading || !isValid} style={{ ...s.primaryBtn, opacity: loading || !isValid ? 0.55 : 1, cursor: loading || !isValid ? 'not-allowed' : 'pointer', border: 'none' }}>
            {loading ? 'Submitting…' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'Inter, system-ui, sans-serif', color: '#111827', minHeight: '100%' },
  pageHeader: { background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '1.5rem' },
  inner: { maxWidth: '620px', margin: '0 auto' },
  backLink: { display: 'inline-block', fontSize: '0.8125rem', color: '#1d4ed8', textDecoration: 'none', marginBottom: '0.75rem', fontWeight: 500 },
  pageTitle: { fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.01em' },
  pageSubtitle: { fontSize: '0.875rem', color: '#6b7280' },
  content: { maxWidth: '620px', margin: '0 auto', padding: '2rem 1.5rem' },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '1.75rem' },
  fieldset: { border: 'none', padding: 0, margin: 0 },
  field: { display: 'flex', flexDirection: 'column' as const, gap: '0.375rem' },
  label: { fontSize: '0.875rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.5rem' },
  req: { color: '#b91c1c', marginLeft: '2px' },
  optional: { color: '#9ca3af', fontWeight: 400 },
  stars: { display: 'flex', gap: '0.25rem', marginBottom: '0.375rem' },
  starBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '2rem', lineHeight: 1 },
  ratingLabel: { fontSize: '0.8125rem', color: '#6b7280' },
  radioGroup: { display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' },
  radioLabel: { display: 'flex', alignItems: 'center', fontSize: '0.9375rem', color: '#374151', cursor: 'pointer' },
  textarea: { padding: '0.625rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '3px', fontSize: '0.9375rem', color: '#111827', background: '#fafaf9', outline: 'none', fontFamily: 'inherit', resize: 'vertical' as const, lineHeight: 1.6 },
  errorMsg: { fontSize: '0.875rem', color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '3px', padding: '0.5rem 0.75rem' },
  primaryBtn: { padding: '0.7rem 1.5rem', background: '#1d4ed8', color: '#ffffff', borderRadius: '3px', fontSize: '0.9375rem', fontWeight: 600, fontFamily: 'inherit', display: 'inline-block', textDecoration: 'none', cursor: 'pointer' },
  successIcon: { width: '48px', height: '48px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: '#15803d', fontWeight: 700 },
  successTitle: { fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' },
  successDesc: { fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 },
};

export default FeedbackPage;
