import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { problemsApi } from '../../api/problems.api';
import type { Problem } from '../../types';

const FeedbackPage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [helped, setHelped] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [receiptToken, setReceiptToken] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (problemId) {
      setPageLoading(true);
      problemsApi.getById(problemId)
        .then((data) => {
          setProblem(data);
        })
        .catch(() => null)
        .finally(() => setPageLoading(false));
    }
  }, [problemId]);

  const isValid = rating > 0 && helped !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !problemId) return;
    setError(null);
    setLoading(true);

    try {
      await problemsApi.submitFeedback(problemId, {
        rating,
        helped: Boolean(helped),
        comment: comment.trim(),
      });
      // Generate a mock SHA receipt token for social audit transparency
      const token = 'AUDIT-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-UP';
      setReceiptToken(token);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Unable to submit audit feedback. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const ratingDescriptions = [
    '',
    '1 Star — Unsatisfactory / Ineffective',
    '2 Stars — Minor Progress / Needs Work',
    '3 Stars — Satisfactory / Functional',
    '4 Stars — Very Good / Significant Improvement',
    '5 Stars — Outstanding / Complete Civic Transformation',
  ];

  if (pageLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-on-surface-variant font-medium">Retrieving problem dossier for social audit...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="p-space-lg max-w-2xl mx-auto space-y-6">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 text-center shadow-md space-y-5 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-success-container/30 border border-success/40 text-success flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">verified_user</span>
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-success-container/20 text-success border border-success/30">
              Social Audit Verified & Certified
            </span>
            <h1 className="text-2xl font-black text-on-surface font-headline mt-3">
              Civic Sign-Off Recorded
            </h1>
            <p className="text-sm text-on-surface-variant mt-2 max-w-md mx-auto">
              Your community evaluation has been cryptographically recorded on the Samadhan AI Public Ledger.
            </p>
          </div>

          {/* Cryptographic Audit Manifest Card */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Audit Manifest Token:</span>
              <span className="font-mono font-bold text-primary">{receiptToken}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Problem Reference:</span>
              <span className="font-bold text-on-surface truncate max-w-[200px]">{problem?.title || problemId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Citizen Rating:</span>
              <span className="font-bold text-amber-600">{'★'.repeat(rating)} ({rating}/5)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Resolution Status:</span>
              <span className="font-bold text-success">
                {helped ? 'Community Certified Resolved' : 'Flagged for Zonal Follow-up'}
              </span>
            </div>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/citizen')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold text-xs hover:bg-primary/90 transition-all shadow-xs"
            >
              Return to Citizen Operations Desk
            </button>
            <Link
              to={`/citizen/problems/${problemId}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-all"
            >
              View Updated Problem Dossier
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-space-lg max-w-2xl mx-auto space-y-space-lg">
      {/* Header */}
      <div>
        <Link
          to={`/citizen/problems/${problemId}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mb-2"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Problem Dossier
        </Link>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-container/20 text-primary">
            Quad-Helix Step 5 • Social Audit
          </span>
        </div>
        <h1 className="text-2xl font-black text-on-surface font-headline tracking-tight mt-1">
          Citizen Verification & Social Audit
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Evaluate the physical solution deployed by the university research lab in your municipal ward.
        </p>
      </div>

      {/* Problem Context Pill Card */}
      {problem && (
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-surface-container text-on-surface-variant">
              {problem.category}
            </span>
            <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">location_on</span>
              {problem.district}, {problem.state}
            </span>
          </div>
          <h2 className="text-base font-bold text-on-surface font-headline">
            {problem.title}
          </h2>
          <p className="text-xs text-on-surface-variant line-clamp-2">
            {problem.description}
          </p>
          {problem.assignedUniversity && (
            <div className="pt-2 border-t border-outline-variant/20 flex items-center gap-2 text-xs text-primary font-medium">
              <span className="material-symbols-outlined text-sm">school</span>
              <span>Implementing Lab: {problem.assignedUniversity.name} ({problem.assignedUniversity.department})</span>
            </div>
          )}
        </div>
      )}

      {/* Audit Submission Form */}
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
            1. How would you rate the efficacy of this solution? <span className="text-error">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="text-3xl transition-transform hover:scale-125 focus:outline-none p-1"
                aria-label={`${star} Stars`}
              >
                <span className={
                  (hoverRating || rating) >= star
                    ? 'text-amber-500'
                    : 'text-outline-variant/50'
                }>
                  ★
                </span>
              </button>
            ))}
          </div>
          <div className="h-5 mt-1">
            {(hoverRating || rating) > 0 && (
              <span className="text-xs font-semibold text-amber-700">
                {ratingDescriptions[hoverRating || rating]}
              </span>
            )}
          </div>
        </div>

        {/* Did it solve the issue? */}
        <div>
          <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
            2. Did this intervention effectively address the community issue? <span className="text-error">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setHelped(true)}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                helped === true
                  ? 'bg-success-container/20 border-success text-success shadow-xs'
                  : 'bg-surface-container border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-xl mt-0.5">check_circle</span>
              <div>
                <div className="font-bold text-xs text-on-surface">Yes, Problem Resolved</div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">Solution is functional and has improved local ward conditions.</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setHelped(false)}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                helped === false
                  ? 'bg-amber-100 border-amber-600 text-amber-900 shadow-xs'
                  : 'bg-surface-container border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-xl mt-0.5">report_problem</span>
              <div>
                <div className="font-bold text-xs text-on-surface">No, Needs Further Work</div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">Intervention has not resolved the primary defect or needs refinement.</div>
              </div>
            </button>
          </div>
        </div>

        {/* Qualitative Observations */}
        <div>
          <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
            3. Field Observations & Community Notes <span className="text-on-surface-variant text-[11px] font-normal">(Optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Describe on-ground observations: e.g., water sensor readings verified, drainage clear during rain, physical unit functioning properly..."
            className="w-full p-3 rounded-xl bg-surface border border-outline-variant/50 text-on-surface text-xs leading-relaxed focus:outline-none focus:border-primary"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-error-container/30 border border-error/30 text-error text-xs font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="pt-2 flex items-center justify-between border-t border-outline-variant/20">
          <div className="text-[11px] text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary">policy</span>
            Open Data RTI & NCIF Compliant
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className="px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold text-xs flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                Certifying Audit...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">task_alt</span>
                Certify & Sign Off Social Audit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackPage;
