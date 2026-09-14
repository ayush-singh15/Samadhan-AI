import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { problemsApi } from '../../api/problems.api';
import { projectsApi } from '../../api/projects.api';
import type { Problem } from '../../types';

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
  if (!f.abstract.trim() || f.abstract.trim().length < 50) e.abstract = 'Abstract must be at least 50 characters detailing the engineering methodology.';
  if (!f.budgetRequired || isNaN(Number(f.budgetRequired)) || Number(f.budgetRequired) <= 0) e.budgetRequired = 'Enter a valid budget amount.';
  if (!f.timelineMonths || isNaN(Number(f.timelineMonths)) || Number(f.timelineMonths) < 1) e.timelineMonths = 'Enter a valid duration in months.';
  return e;
}

const ProposalForm: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [form, setForm] = useState<FormState>({
    title: '',
    abstract: '',
    budgetRequired: '1450000',
    timelineMonths: '4',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (problemId) {
      problemsApi.getById(problemId)
        .then((p) => {
          setProblem(p);
          if (p) {
            setForm((f) => ({
              ...f,
              title: f.title || `Feasibility & Prototyping: ${p.title}`,
            }));
          }
        })
        .catch(() => null);
    }
  }, [problemId]);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitError(null);
    setLoading(true);

    try {
      await projectsApi.createProposal({
        problemId: problemId!,
        title: form.title,
        abstract: form.abstract,
        budgetRequired: Number(form.budgetRequired),
        timelineMonths: Number(form.timelineMonths),
      });
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface p-space-lg flex items-center justify-center">
        <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-2xl text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 text-green-700 flex items-center justify-center mx-auto mb-space-lg text-2xl font-bold">
            <span className="material-symbols-outlined text-[32px]">task_alt</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-space-xs">
            Proposal Dispatched
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-space-xl leading-relaxed">
            Your technical solution proposal has been logged to the state civic ledger and queued for municipal sign-off and CSR funding allocation.
          </p>
          <button
            onClick={() => navigate('/university')}
            className="w-full py-3 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm hover:bg-primary-container transition-all shadow-md"
          >
            Return to Operations Desk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-space-lg">
      <div className="max-w-3xl mx-auto flex flex-col gap-space-lg">

        {/* Header Breadcrumb */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-xs">
          <Link
            to="/university/problems"
            className="inline-flex items-center gap-1 text-primary font-label-md text-label-md hover:underline mb-space-xs"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Assigned Mandates
          </Link>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">
            Submit Solution Proposal
          </h1>
          {problem && (
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Engineering Mandate: <strong className="text-on-surface">{problem.title}</strong> · {problem.district}, {problem.state}
            </p>
          )}
        </div>

        {/* Proposal Form Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-xl shadow-xs">
          {submitError && (
            <div className="mb-space-lg p-space-md rounded-xl bg-error-container text-on-error-container font-body-sm text-body-sm flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-error text-[20px]">error</span>
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-space-lg">
            <div>
              <label htmlFor="pf-title" className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                Proposal Title <span className="text-error">*</span>
              </label>
              <input
                id="pf-title"
                type="text"
                value={form.title}
                onChange={set('title')}
                placeholder="e.g. Decentralized Solar Cold Storage Unit with Phase Change Thermal Buffering"
                disabled={loading}
                className="w-full px-space-md py-2.5 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.title && <p className="text-error font-body-sm text-[11px] mt-1">{errors.title}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="pf-abstract" className="block font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Technical Abstract & Methodology <span className="text-error">*</span>
                </label>
                <span className="font-code text-code text-[11px] text-on-surface-variant">
                  {form.abstract.length} characters
                </span>
              </div>
              <textarea
                id="pf-abstract"
                value={form.abstract}
                onChange={set('abstract')}
                rows={6}
                placeholder="Describe your lab's engineering approach, system architecture, telemetry hardware, and expected community outcome…"
                disabled={loading}
                className="w-full px-space-md py-2.5 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
              />
              {errors.abstract && <p className="text-error font-body-sm text-[11px] mt-1">{errors.abstract}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div>
                <label htmlFor="pf-budget" className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                  Budget Required (₹) <span className="text-error">*</span>
                </label>
                <input
                  id="pf-budget"
                  type="number"
                  min="1"
                  value={form.budgetRequired}
                  onChange={set('budgetRequired')}
                  placeholder="1450000"
                  disabled={loading}
                  className="w-full px-space-md py-2.5 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.budgetRequired && <p className="text-error font-body-sm text-[11px] mt-1">{errors.budgetRequired}</p>}
              </div>

              <div>
                <label htmlFor="pf-months" className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                  Target Timeline (Months) <span className="text-error">*</span>
                </label>
                <input
                  id="pf-months"
                  type="number"
                  min="1"
                  max="48"
                  value={form.timelineMonths}
                  onChange={set('timelineMonths')}
                  placeholder="4"
                  disabled={loading}
                  className="w-full px-space-md py-2.5 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.timelineMonths && <p className="text-error font-body-sm text-[11px] mt-1">{errors.timelineMonths}</p>}
              </div>
            </div>

            {/* Tranche Policy Notice */}
            <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">info</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px] leading-relaxed">
                Upon administrative approval or CSR co-financing, this proposal will automatically unlock a 3-stage milestone tranche release schedule (30% Inception, 40% Field Deployment, 30% Public Handover).
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-space-md pt-space-xs">
              <button
                type="submit"
                disabled={loading}
                className="px-space-xl py-3 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm shadow-md hover:bg-primary-container transition-all disabled:opacity-50 flex items-center gap-space-xs"
              >
                {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                {loading ? 'Transmitting Mandate…' : 'Submit Proposal to Administration'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/university/problems')}
                disabled={loading}
                className="px-space-lg py-3 rounded-xl border border-outline-variant text-on-surface font-headline-sm text-headline-sm hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ProposalForm;
