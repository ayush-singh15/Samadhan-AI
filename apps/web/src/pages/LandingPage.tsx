import React from 'react';
import { Link } from 'react-router-dom';

// -----------------------------------------------------------------------
// Data
// -----------------------------------------------------------------------

const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Proposal Submission',
    desc: 'Students and faculty submit structured project proposals linked to a real societal problem statement.',
  },
  {
    step: 2,
    title: 'Mentor Review',
    desc: 'Faculty mentors evaluate proposals against defined evaluation rubrics and approve them for funding consideration.',
  },
  {
    step: 3,
    title: 'Milestone-Based Funding',
    desc: 'Approved projects receive tranched funding tied to verifiable milestones, disbursed on completion.',
  },
  {
    step: 4,
    title: 'MoU & Disbursement',
    desc: 'System auto-generates a binding MoU between all parties; funds are disbursed through a regulated escrow mechanism.',
  },
];

const TRUST_FEATURES = [
  {
    title: 'Escrow-Style Fund Holding',
    desc: 'All project funds are held in a regulated escrow account and released only upon verified milestone completion.',
  },
  {
    title: 'Milestone-Based Disbursement',
    desc: 'No lump-sum transfers. Each milestone must be submitted, reviewed, and approved before the next tranche is released.',
  },
  {
    title: 'Auto-Generated MoU',
    desc: 'A legally structured Memorandum of Understanding is automatically generated when a project is approved, binding all parties.',
  },
  {
    title: 'University Reputation Score',
    desc: 'Universities are scored on project success rates, mentor responsiveness, and fund utilisation efficiency.',
  },
  {
    title: 'Faculty Accountability',
    desc: 'Faculty mentors are tracked for review turnaround times and milestone approval accuracy, building a verifiable track record.',
  },
];

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

const LandingPage: React.FC = () => {
  return (
    <div style={styles.page}>
      {/* ----------------------------------------------------------------
          Hero Section
      ---------------------------------------------------------------- */}
      <section style={styles.hero} aria-labelledby="hero-heading">
        <div style={styles.heroBadge}>Government of India Initiative</div>
        <h1 id="hero-heading" style={styles.heroHeading}>
          Building trust between universities, students, and industry partners
          — through accountable seed funding.
        </h1>
        <p style={styles.heroSubtext}>
          TriSetu connects the three pillars of innovation — academia, industry,
          and civil society — on a single platform governed by transparency,
          structured milestones, and automated accountability.
        </p>
        <div style={styles.heroActions}>
          <Link to="/login" style={styles.primaryBtn} id="hero-cta-login">
            Access Platform
          </Link>
          <a href="#how-it-works" style={styles.secondaryBtn} id="hero-cta-learn">
            Learn How It Works
          </a>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          How TriSetu Works
      ---------------------------------------------------------------- */}
      <section
        id="how-it-works"
        style={styles.section}
        aria-labelledby="how-it-works-heading"
      >
        <div style={styles.sectionInner}>
          <h2 id="how-it-works-heading" style={styles.sectionHeading}>
            How TriSetu Works
          </h2>
          <p style={styles.sectionSubtext}>
            A structured, four-stage process from idea to funded prototype.
          </p>

          <div style={styles.stepsGrid}>
            {HOW_IT_WORKS_STEPS.map((item) => (
              <div key={item.step} style={styles.stepCard}>
                <div style={styles.stepNumber}>{item.step}</div>
                <h3 style={styles.stepTitle}>{item.title}</h3>
                <p style={styles.stepDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          Trust & Accountability
      ---------------------------------------------------------------- */}
      <section
        id="trust-accountability"
        style={{ ...styles.section, background: '#f0f4f8' }}
        aria-labelledby="trust-heading"
      >
        <div style={styles.sectionInner}>
          <h2 id="trust-heading" style={styles.sectionHeading}>
            Trust &amp; Accountability
          </h2>
          <p style={styles.sectionSubtext}>
            Every rupee, every milestone, every obligation — tracked and verified.
          </p>

          <div style={styles.trustGrid}>
            {TRUST_FEATURES.map((feature) => (
              <div key={feature.title} style={styles.trustCard}>
                <h3 style={styles.trustTitle}>{feature.title}</h3>
                <p style={styles.trustDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          Call to Action strip
      ---------------------------------------------------------------- */}
      <section style={styles.ctaStrip} aria-labelledby="cta-heading">
        <div style={styles.sectionInner}>
          <h2 id="cta-heading" style={styles.ctaHeading}>
            Ready to participate?
          </h2>
          <p style={styles.ctaSubtext}>
            Universities, faculty, students, and industry partners can register
            and get started today.
          </p>
          <Link to="/login" style={styles.primaryBtn} id="landing-bottom-cta">
            Sign In / Register
          </Link>
        </div>
      </section>
    </div>
  );
};

// -----------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: 'Inter, system-ui, sans-serif',
    color: '#111827',
  },

  // Hero
  hero: {
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '4rem 1.5rem 3.5rem',
    maxWidth: '860px',
    margin: '0 auto',
    textAlign: 'center',
  },
  heroBadge: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#1d4ed8',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '3px',
    padding: '0.25rem 0.75rem',
    marginBottom: '1.25rem',
  },
  heroHeading: {
    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
    fontWeight: 700,
    lineHeight: 1.3,
    color: '#111827',
    margin: '0 0 1rem',
    letterSpacing: '-0.02em',
  },
  heroSubtext: {
    fontSize: '1rem',
    color: '#6b7280',
    lineHeight: 1.7,
    margin: '0 0 2rem',
    maxWidth: '680px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  heroActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    display: 'inline-block',
    padding: '0.7rem 1.75rem',
    background: '#1d4ed8',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '3px',
    fontWeight: 600,
    fontSize: '0.9375rem',
  },
  secondaryBtn: {
    display: 'inline-block',
    padding: '0.7rem 1.75rem',
    background: 'transparent',
    color: '#374151',
    textDecoration: 'none',
    borderRadius: '3px',
    fontWeight: 600,
    fontSize: '0.9375rem',
    border: '1px solid #d1d5db',
  },

  // Sections
  section: {
    background: '#ffffff',
    padding: '3.5rem 1.5rem',
  },
  sectionInner: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  sectionHeading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 0.5rem',
    letterSpacing: '-0.015em',
  },
  sectionSubtext: {
    fontSize: '0.9375rem',
    color: '#6b7280',
    margin: '0 0 2.5rem',
  },

  // Steps
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
  },
  stepCard: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    padding: '1.5rem',
  },
  stepNumber: {
    width: '36px',
    height: '36px',
    background: '#1d4ed8',
    color: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.9375rem',
    marginBottom: '0.875rem',
  },
  stepTitle: {
    fontSize: '0.9375rem',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 0.5rem',
  },
  stepDesc: {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: 1.6,
    margin: 0,
  },

  // Trust cards
  trustGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem',
  },
  trustCard: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderLeft: '3px solid #1d4ed8',
    borderRadius: '4px',
    padding: '1.25rem 1.5rem',
  },
  trustTitle: {
    fontSize: '0.9375rem',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 0.5rem',
  },
  trustDesc: {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: 1.6,
    margin: 0,
  },

  // CTA strip
  ctaStrip: {
    background: '#1d4ed8',
    padding: '3rem 1.5rem',
    textAlign: 'center',
  },
  ctaHeading: {
    fontSize: '1.375rem',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 0.5rem',
  },
  ctaSubtext: {
    fontSize: '0.9375rem',
    color: '#bfdbfe',
    margin: '0 0 1.75rem',
  },
};

export default LandingPage;
