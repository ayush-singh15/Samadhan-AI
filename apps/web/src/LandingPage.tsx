import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './components/ui/BrandLogo';
import { problemsApi } from './api/problems.api';
import type { Problem } from './types';

const PIPELINE_STEPS = [
  { n: 1, title: 'Citizen Reports', tag: 'Ward & GPS', desc: 'Geo-tagged submissions with photo telemetry, ward jurisdiction, and grassroots citizen corroboration.' },
  { n: 2, title: 'AI & Admin Review', tag: 'Automated Triage', desc: 'De-duplication, severity calculation, safety screening, and department assignment within 24h.' },
  { n: 3, title: 'University Match', tag: 'IITs / Labs', desc: 'Matched with university capstone cohorts, innovation hubs, and SIH prototypes for technical feasibility.' },
  { n: 4, title: 'CSR Co-Financing', tag: 'Sec. 135 MCA', desc: 'Corporate partners co-fund high-impact solutions through MCA-compliant CSR escrow disbursement.' },
  { n: 5, title: 'Community Solution Delivered', tag: 'Live Audit', desc: 'Deployed prototype monitored by original citizen, government inspector, and academic institution.' },
];

const HOW_STEPS = [
  { step: '01', title: 'Grassroots Ingestion', icon: 'sensors', desc: 'Citizens log infrastructure failures, water contamination, agrarian bottlenecks or sanitation hazards via mobile or web — geotagged, media-verified, and ward-stamped.' },
  { step: '02', title: 'Academic Lab Allocation', icon: 'biotech', desc: 'AI extracts technical requirements and matches to university capstone cohorts, innovation hubs, and SIH prototypes for optimal research feasibility.' },
  { step: '03', title: 'Agile CSR Co-Financing', icon: 'account_balance_wallet', desc: 'Corporate partners co-fund high-impact solutions through MCA-compliant CSR escrow disbursement with transparent milestone-linked tranche releases.' },
  { step: '04', title: 'Public Deployment & Audit', icon: 'verified_user', desc: 'Government conducts an open transparent audit. The deployed system is monitored live by the citizen, municipal inspector, and university team.' },
];

const STAKEHOLDERS = [
  { icon: 'person', label: 'Citizens & Communities', color: 'text-primary', bg: 'bg-primary/10', features: ['Real-time problem reporting', 'Live milestone tracking', 'Community social audits & feedback'], cta: 'Report a Problem', to: '/login' },
  { icon: 'account_balance', label: 'Municipal Administration', color: 'text-secondary', bg: 'bg-secondary/10', features: ['Automated problem triage', 'Agile zonal governance', 'RFP tender & milestone sign-offs'], cta: 'Admin Console', to: '/login' },
  { icon: 'school', label: 'Universities & Labs', color: 'text-tertiary', bg: 'bg-tertiary/10', features: ['Direct access to civic grant funding', 'SIH prototype deployment pipeline', 'High-impact patent & paper output'], cta: 'University R&D Portal', to: '/login' },
  { icon: 'business', label: 'Industry & CSR Partners', color: 'text-primary-container', bg: 'bg-primary-container/10', features: ['Sec. 135 MCA audit compliance', 'Automated ESG impact analytics', 'Tranche-released escrow contracts'], cta: 'CSR Onboarding', to: '/login' },
];

const IMPACT_STATS = [
  { value: '12,480+', label: 'Civic Problems Tracked', sub: 'Real-time telemetry', icon: 'campaign' },
  { value: '340+', label: 'Research Partnerships', sub: 'Across 18 States & UTs', icon: 'school' },
  { value: '180+', label: 'Universities & Institutions', sub: 'Active academic nodes', icon: 'account_balance' },
  { value: '84%', label: 'Resolution Rate', sub: 'Verified disposal percentage', icon: 'verified' },
  { value: '₹14.5 Cr', label: 'Total CSR Deployed', sub: 'Sec. 135 MCA Compliant', icon: 'account_balance_wallet' },
];

const LandingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemsLoading, setProblemsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    problemsApi.getAll()
      .then((data) => setProblems(data))
      .catch(() => setProblems([]))
      .finally(() => setProblemsLoading(false));
  }, []);

  const filteredProblems = selectedFilter === 'All'
    ? problems
    : problems.filter((p) => p.category.toLowerCase().includes(selectedFilter.toLowerCase()));

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md">

      {/* ─── Navbar ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/30">
        <div className="h-16 max-w-max-width mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-lg">
            <Link to="/" className="flex items-center">
              <BrandLogo size="md" />
            </Link>
            <nav className="hidden lg:flex items-center gap-space-lg">
              {['Overview', 'Civic Initiatives', 'University Alliances', 'CSR & Industry', 'Transparency Portal'].map((item, i) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className={`py-2 transition-colors font-label-lg text-label-lg ${
                    i === 0 ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="hidden sm:flex items-center bg-surface-container-low border border-outline-variant/50 rounded-xl p-space-2xs">
              <Link to="/login" className="px-space-sm py-1 rounded-lg text-on-primary bg-primary font-label-md text-label-md shadow-xs">
                Citizen
              </Link>
              <Link to="/login" className="px-space-sm py-1 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors">
                Academic
              </Link>
              <Link to="/login" className="px-space-sm py-1 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors">
                Admin
              </Link>
              <Link to="/login" className="px-space-sm py-1 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors">
                CSR
              </Link>
            </div>

            <Link
              to="/login"
              className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-all shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              Enter Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full pt-16 bg-surface">

        {/* ─── Sub-Header Alert Banner (Live Civic Grid) ──────────────────── */}
        <section className="w-full bg-surface-container-high py-space-xs px-margin-mobile md:px-margin-tablet lg:px-margin-desktop border-b border-outline-variant/20">
          <div className="max-w-max-width mx-auto flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-caps font-label-caps bg-primary text-on-primary tracking-wider uppercase font-bold text-[10px]">
                Live Civic Grid
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping" />
                NCIF Compliant: Active municipal research mandates operating across Uttar Pradesh, Karnataka & Maharashtra.
              </p>
            </div>
            <a href="#problems" className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1 font-semibold">
              <span>Active Problems Feed</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>
        </section>

        {/* ─── Hero Section ────────────────────────────────────────────────── */}
        <section id="overview" className="relative w-full overflow-hidden bg-surface py-space-2xl md:py-space-3xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-0" />
          <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-tertiary/10 blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 max-w-max-width mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            
            {/* Left Column: Vision & CTAs */}
            <div className="lg:col-span-7 space-y-space-lg">
              <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-highest text-primary font-label-md text-label-md border border-primary/20">
                <span className="material-symbols-outlined text-[16px]">account_balance</span>
                <span>Digital Public Infrastructure for Quad-Helix Civic Action</span>
              </div>

              <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-[1.08] font-bold">
                Turn Local Problems Into <span className="text-primary-container bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">Real Solutions</span>.
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Connecting Citizens, Municipal Administration, University Labs, and Corporate CSR to resolve grassroots community challenges through research-backed prototypes and transparent milestone-linked funding.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-space-sm px-space-lg py-3 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm shadow-md hover:bg-primary-container transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">campaign</span>
                  <span>Report a Problem</span>
                </Link>
                <a
                  href="#problems"
                  className="inline-flex items-center gap-space-xs px-space-lg py-3 rounded-xl bg-surface-container-low text-on-surface font-headline-sm text-headline-sm shadow-sm hover:bg-surface-container-high transition-colors border border-outline-variant/30"
                >
                  <span>Explore Problems</span>
                  <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                </a>
                <a
                  href="#impact"
                  className="inline-flex items-center gap-1 text-primary font-label-lg text-label-lg hover:underline py-2"
                >
                  <span>View Impact Ledger</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-space-md flex flex-wrap items-center gap-space-lg text-on-surface-variant border-t border-outline-variant/20">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                  <span className="font-label-md text-label-md font-semibold">NCIF Pilot Node</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">security</span>
                  <span className="font-label-md text-label-md font-semibold">RTI Transparency Compliant</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">handshake</span>
                  <span className="font-label-md text-label-md font-semibold">MCA Sec. 135 CSR Audited</span>
                </div>
              </div>
            </div>

            {/* Right Column: 5-Node Pipeline Interactive Card */}
            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-space-lg space-y-space-md border border-outline-variant/30">
                <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
                  <div>
                    <p className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-bold">Algorithmic Lifecycle</p>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">The 5-Node Setu Pipeline</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-code text-code text-xs font-bold">
                    v3.4 Production
                  </span>
                </div>

                <div className="space-y-space-xs">
                  {PIPELINE_STEPS.map((step) => {
                    const isCurrent = activeStep === step.n;
                    return (
                      <div key={step.n} onClick={() => setActiveStep(step.n)} className="cursor-pointer">
                        <div className={`p-space-sm rounded-xl transition-all duration-200 flex items-start gap-space-sm ${
                          isCurrent ? 'bg-primary/5 border border-primary/30 shadow-xs' : 'bg-surface-container-low hover:bg-surface-container'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-headline-sm text-headline-sm shrink-0 ${
                            isCurrent ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                          }`}>
                            {step.n}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-headline-sm text-headline-sm font-bold ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                                {step.title}
                              </h4>
                              <span className="font-label-caps text-label-caps text-primary bg-surface-container px-2 py-0.5 rounded-full font-bold">
                                {step.tag}
                              </span>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 text-[12px]">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                        {step.n < 5 && <div className="h-2 w-0.5 bg-outline-variant/40 ml-7 my-0.5" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── How Samadhan AI Works ────────────────────────────────────────── */}
        <section id="civic-initiatives" className="w-full py-space-2xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-surface-container-low/50">
          <div className="max-w-max-width mx-auto">
            <div className="text-center mb-space-xl">
              <p className="font-label-caps text-label-caps text-primary uppercase tracking-wider mb-space-xs font-bold">The Innovation Engine</p>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">How Samadhan AI Works</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
                A closed-loop systemic framework replacing fragmented municipal grievance tickets with engineering prototypes and audited milestone releases.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              {HOW_STEPS.map(({ step, title, icon, desc }) => (
                <div key={step} className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs hover:shadow-md transition-shadow border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[24px]">{icon}</span>
                      </div>
                      <span className="font-code text-code text-primary font-bold text-lg">{step}</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">{title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-[13px]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Quad-Helix Alliance ─────────────────────────────────────────── */}
        <section id="university-alliances" className="w-full py-space-2xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="max-w-max-width mx-auto">
            <div className="text-center mb-space-xl">
              <p className="font-label-caps text-label-caps text-primary uppercase tracking-wider mb-space-xs font-bold">Four Pillars of Impact</p>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">The Quad-Helix Alliance</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
                Each stakeholder constituency operates with dedicated tools, cryptographic traceability, and role-specific governance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              {STAKEHOLDERS.map(({ icon, label, color, bg, features, cta, to }) => (
                <div key={label} className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs hover:shadow-md transition-all border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-space-md`}>
                      <span className={`material-symbols-outlined ${color} text-[26px]`}>{icon}</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-sm">{label}</h3>
                    <ul className="space-y-2 mb-space-lg">
                      {features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface-variant text-[13px]">
                          <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">check_circle</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    to={to}
                    className="w-full py-2.5 rounded-xl border border-outline-variant text-on-surface font-label-md text-label-md font-semibold text-center hover:bg-surface-container-high transition-colors block"
                  >
                    {cta} →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Live Problems Feed (Direct from Cloud DB) ──────────────────── */}
        <section id="problems" className="w-full py-space-2xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-surface-container-low/40">
          <div className="max-w-max-width mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl">
              <div>
                <p className="font-label-caps text-label-caps text-primary uppercase tracking-wider mb-space-xs font-bold">Real-Time Telemetry</p>
                <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">Live Community Problems</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Crowdsourced from wards across India, verified by municipal engineers, and routed to university labs.
                </p>
              </div>

              <div className="flex gap-space-xs mt-space-md md:mt-0 flex-wrap">
                {['All', 'Water', 'Agriculture', 'Infrastructure', 'Environment'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-colors ${
                      selectedFilter === filter
                        ? 'bg-primary text-on-primary font-bold shadow-xs'
                        : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/30'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {problemsLoading ? (
              <div className="p-space-2xl text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-4xl animate-spin mb-2">refresh</span>
                <p className="font-body-md text-body-md text-on-surface-variant">Fetching live cases from Neon Data Mesh…</p>
              </div>
            ) : filteredProblems.length === 0 ? (
              <div className="p-space-2xl text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
                <p className="font-body-md text-body-md text-on-surface-variant">No active problems under this category filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                {filteredProblems.slice(0, 6).map((p) => (
                  <div key={p.id} className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs hover:shadow-md transition-all border border-outline-variant/30 flex flex-col justify-between">
                    <div>
                      {/* Image Thumbnail if exists */}
                      {p.mediaUrls && p.mediaUrls.length > 0 && (
                        <div className="h-40 w-full rounded-xl overflow-hidden mb-space-md bg-surface-container">
                          <img
                            src={p.mediaUrls[0]}
                            alt={p.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-space-xs">
                        <span className="px-2.5 py-0.5 rounded-full font-label-caps text-label-caps bg-primary/10 text-primary font-bold text-[10px]">
                          {p.category.replace(/_/g, ' ')}
                        </span>
                        <span className="font-code text-code text-on-surface-variant text-[11px]">
                          {p.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs line-clamp-2">
                        {p.title}
                      </h3>

                      <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mb-space-md text-[12px]">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {p.district}, {p.state}
                      </p>

                      <p className="font-body-sm text-body-sm text-on-surface-variant/80 line-clamp-2 text-[12px] mb-space-md">
                        {p.description}
                      </p>
                    </div>

                    <div className="pt-space-sm border-t border-outline-variant/20 flex items-center justify-between">
                      <span className="font-label-caps text-[10px] text-on-surface-variant">
                        Node: {p.assignedUniversity?.name ? 'Assigned' : 'Open for R&D'}
                      </span>
                      <Link
                        to="/login"
                        className="font-label-md text-label-md text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        Inspect Dossier →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Ingestion Callout */}
            <div className="mt-space-xl bg-primary/5 rounded-2xl p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md border border-primary/20">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Notice an engineering failure or civic hazard in your ward?
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Submit photo telemetry and geotagged evidence. Our AI categorizes and routes it to academic labs within 24 hours.
                </p>
              </div>
              <Link
                to="/login"
                className="px-space-lg py-3 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm shadow-md hover:bg-primary-container transition-all whitespace-nowrap"
              >
                + Submit Ward Challenge
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Impact Statistics ───────────────────────────────────────────── */}
        <section id="impact" className="w-full py-space-2xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="max-w-max-width mx-auto">
            <div className="text-center mb-space-xl">
              <p className="font-label-caps text-label-caps text-primary uppercase tracking-wider mb-space-xs font-bold">National Innovation Footprint</p>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">Verified Impact Metrics</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Audited records operating across urban local bodies, district collectorates, and research laboratories.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-space-lg">
              {IMPACT_STATS.map(({ value, label, sub, icon }) => (
                <div key={label} className="bg-surface-container-lowest rounded-2xl p-space-lg text-center shadow-xs border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-3xl block mb-space-sm">{icon}</span>
                  <p className="font-headline-lg text-headline-lg text-on-surface font-extrabold">{value}</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mt-1 text-[10px] font-bold">{label}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA ───────────────────────────────────────────────────── */}
        <section id="transparency-portal" className="w-full bg-[#0F2942] py-space-2xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop text-white">
          <div className="max-w-max-width mx-auto flex flex-col lg:flex-row items-center justify-between gap-space-xl">
            <div>
              <p className="font-label-caps text-label-caps text-[#0E8388] uppercase tracking-wider mb-space-sm font-bold">
                Digital Public Infrastructure (DPI)
              </p>
              <h2 className="font-headline-xl text-headline-xl text-white font-bold mb-space-sm">
                Ready to transform municipal challenges into lasting solutions?
              </h2>
              <p className="font-body-lg text-body-lg text-slate-300 max-w-2xl leading-relaxed">
                Whether you're a citizen reporting civic infrastructure, an academic lab pioneering prototypes, or an industry partner allocating CSR capital — Samadhan AI bridges the loop with transparent accountability.
              </p>
            </div>
            <div className="flex flex-col gap-space-sm min-w-[240px]">
              <Link
                to="/login"
                className="px-space-lg py-3.5 rounded-xl bg-[#0E8388] text-white font-headline-sm text-headline-sm shadow-lg hover:bg-primary transition-all text-center font-bold"
              >
                Enter Quad-Helix Portal
              </Link>
              <Link
                to="/login"
                className="px-space-lg py-3 rounded-xl bg-white/10 text-white font-headline-sm text-headline-sm border border-white/20 hover:bg-white/20 transition-all text-center"
              >
                Register Institution / CSR
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Footer ──────────────────────────────────────────────────────── */}
        <footer className="w-full bg-[#0B1E30] border-t border-slate-800 py-space-xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop text-white">
          <div className="max-w-max-width mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-space-xl mb-space-xl">
              <div>
                <div className="mb-space-md">
                  <BrandLogo variant="dark" size="md" />
                </div>
                <p className="font-body-sm text-body-sm text-slate-400 leading-relaxed text-[13px]">
                  Digital Public Infrastructure connecting Citizens, Government, Universities, and CSR Capital in accountable civic action.
                </p>
              </div>

              {[
                { title: 'Constituencies', links: ['Citizen Problem Ingestion', 'University R&D Alliances', 'CSR Industry Financing', 'Zonal Municipal Triage'] },
                { title: 'Standards & Governance', links: ['RTI Audit Compliance', 'Data Privacy Framework', 'MCA Sec. 135 CSR Guidelines', 'Academic Ethics Council'] },
                { title: 'National Architecture', links: ['NCIF Documentation', 'Open API Data Mesh', 'State Node Directory', 'Transparency Portal'] },
              ].map(({ title, links }) => (
                <div key={title}>
                  <h4 className="font-label-lg text-label-lg text-white font-bold mb-space-md">{title}</h4>
                  <ul className="space-y-space-xs">
                    {links.map((l) => (
                      <li key={l}>
                        <a href="#" className="font-body-sm text-body-sm text-slate-400 hover:text-white transition-colors text-[13px]">
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
              <div className="flex flex-wrap items-center gap-space-lg text-slate-400">
                {[
                  { icon: 'gavel', text: 'Right to Information (RTI)' },
                  { icon: 'dataset', text: 'Open Data DPI Mandate' },
                  { icon: 'policy', text: 'Ministry of Housing & Urban Affairs' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[#0E8388] text-[18px]">{icon}</span>
                    <span className="font-label-md text-label-md text-[12px]">{text}</span>
                  </div>
                ))}
              </div>
              <p className="font-body-sm text-body-sm text-slate-500 text-[12px]">
                © 2026 Samadhan AI Platform. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
