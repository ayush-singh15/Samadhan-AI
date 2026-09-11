import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PIPELINE_STEPS = [
  { n: 1, title: 'Citizen Reports', tag: 'Ward & GPS', desc: 'Geo-tagged submissions with photo telemetry, ward jurisdiction, and grassroots citizen corroboration.', active: true },
  { n: 2, title: 'AI & Admin Review', tag: 'Automated Triage', desc: 'De-duplication, severity calculation, safety screening, and department assignment within 24h.', active: false },
  { n: 3, title: 'University Match', tag: 'IITs / Labs', desc: 'Matched with university capstone cohorts, innovation hubs, and SIH prototypes for technical feasibility.', active: false },
  { n: 4, title: 'CSR Co-Financing', tag: 'Sec. 135 MCA', desc: 'Corporate partners co-fund high-impact solutions through MCA-compliant CSR escrow disbursement.', active: false },
  { n: 5, title: 'Community Solution Delivered', tag: 'Active', desc: 'Deployed solution monitored by original citizen, government inspector, and academic institution.', active: false },
];

const HOW_STEPS = [
  { step: '01', title: 'Grassroots Ingestion', icon: 'sensors', desc: 'Citizens log infrastructure failures, water issues, energy gaps or health hazards via mobile or web — geotagged, media-verified, and ward-stamped.' },
  { step: '02', title: 'Academic Lab Allocation', icon: 'biotech', desc: 'AI extracts technical requirements and matches to university capstone cohorts, innovation hubs, and SIH prototypes for the optimal research assignment.' },
  { step: '03', title: 'Agile CSR Co-Financing', icon: 'account_balance_wallet', desc: 'Corporate partners co-fund high-impact solutions through MCA-compliant CSR escrow disbursement with transparent milestone-linked tranche releases.' },
  { step: '04', title: 'Public Deployment & Audit', icon: 'verified_user', desc: 'The government conducts an open transparent audit. The deployed system is monitored by the original reporting citizen, government inspector, and academic institution.' },
];

const STAKEHOLDERS = [
  { icon: 'person', label: 'Citizens & Communities', color: 'text-primary', bg: 'bg-primary-container/20', features: ['Real-time problem reporting', 'Milestone notifications', 'Community social audits and tags'], cta: 'Start Citizen Report', to: '/register' },
  { icon: 'account_balance', label: 'Municipal Administration', color: 'text-secondary', bg: 'bg-secondary-container/30', features: ['Automated problem triage', 'Agile-responsive governance', 'Forward-prioritized milestones'], cta: 'Admin & G/B Panel', to: '/register' },
  { icon: 'school', label: 'Universities & Labs', color: 'text-tertiary', bg: 'bg-tertiary-fixed/40', features: ['Prototyping access to funds', 'Civic SIH ecosystem integration', 'Post-pilot paper publications'], cta: 'University Access', to: '/register' },
  { icon: 'business', label: 'Industry & CSR Partners', color: 'text-primary-container', bg: 'bg-surface-container-highest', features: ['Sec. 135 MCA compliance', 'ESG impact reporting', 'Tax-compliant grant governance'], cta: 'CSR Onboarding', to: '/register' },
];

const SAMPLE_PROBLEMS = [
  { category: 'Critical Flood', cat_color: 'bg-error-container text-on-error-container', title: 'Urban Flooding & Silt Inversion in Ward 10 Koramangala', loc: 'Koramangala, Bengaluru, KA', upvotes: 342, status: 'Under Review', tag: 'High Priority' },
  { category: 'AgriField', cat_color: 'bg-tertiary-fixed text-tertiary', title: 'Groundwater Arsenic Rapid Colorimetric Field Testing', loc: 'Dhar district, Madhya Pradesh', upvotes: 198, status: 'AI Categorized', tag: 'Public Health' },
  { category: 'Bio-Clustered', cat_color: 'bg-primary-fixed/60 text-primary', title: 'Decentralized Solar Cold-Storage for Part-Urban Farmers', loc: 'Renewable Energy & Waste, Pune, MH', upvotes: 427, status: 'In Progress', tag: 'Tier-2 Cities' },
];

const IMPACT_STATS = [
  { value: '12,480+', label: 'Civic Problems Tracked', sub: 'Updated in API seconds', icon: 'campaign' },
  { value: '340+', label: 'Research Partnerships', sub: 'Across 18 States & 5 UTs', icon: 'school' },
  { value: '180+', label: 'Universities & Institutions', sub: 'Active innovation alliance', icon: 'account_balance' },
  { value: '84%', label: 'Approval Rate', sub: 'Disposal rate percentage', icon: 'verified' },
  { value: '₹4.2 Cr', label: 'Total CSR', sub: 'Sec. 135 Compliant Audit', icon: 'account_balance_wallet' },
];

const LandingPage: React.FC = () => {
  const [roleTab, setRoleTab] = useState<'Citizen' | 'Academic' | 'Admin' | 'CSR'>('Citizen');

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md">

      {/* ─── Navbar ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/30">
        <div className="h-16 max-w-max-width mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-lg">
            <Link to="/" className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-on-primary font-bold text-sm">TS</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight">TriSetu</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-space-lg">
              {['Overview', 'Civic Initiatives', 'University Alliances', 'CSR & Industry', 'Transparency Portal'].map((item, i) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className={`py-2 transition-colors font-label-lg text-label-lg ${i === 0 ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="hidden sm:flex items-center bg-surface-container-low border border-outline-variant/50 rounded-xl p-space-2xs">
              {(['Citizen', 'Academic', 'Admin', 'CSR'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleTab(r)}
                  className={`px-space-sm py-1 rounded-lg font-label-md text-label-md transition-colors ${roleTab === r ? 'text-on-primary bg-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <Link to="/login" className="flex items-center gap-space-xs pl-space-xs">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">arrow_drop_down</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full pt-16 bg-surface">

        {/* ─── Alert Banner ───────────────────────────────────────────────── */}
        <section className="w-full bg-surface-container-high py-space-xs px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="max-w-max-width mx-auto flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-caps text-label-caps bg-primary-container text-on-primary-container tracking-wider uppercase">Live Civic Grid</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping" />
                NCIF Compliant: 28 new municipal grant pilots authorized across Karnataka, Maharashtra & Tamil Nadu this week.
              </p>
            </div>
            <a href="#problems" className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1">
              Active Wards Feed
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>
        </section>

        {/* ─── Hero ───────────────────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden bg-surface py-space-2xl md:py-space-3xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-tertiary/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-max-width mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">

            {/* Left */}
            <div className="lg:col-span-7 space-y-space-lg">
              <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-highest text-primary font-label-md text-label-md">
                <span className="material-symbols-outlined text-[16px]">account_balance</span>
                Digital Public Infrastructure for Quad-Helix Civic Action
              </div>
              <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-[1.08]">
                Turn Local Problems Into{' '}
                <span className="text-primary">Real Solutions</span>.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Connecting Citizens, Government, Universities, and Industry to solve community challenges through structured civic collaboration, research-backed prototypes, and transparent milestone tracking.
              </p>
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <Link to="/register" className="inline-flex items-center gap-space-sm px-space-lg py-3 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm shadow-md hover:bg-primary-container transition-all duration-200">
                  <span className="material-symbols-outlined text-[20px]">campaign</span>
                  Report a Problem
                </Link>
                <a href="#problems" className="inline-flex items-center gap-space-xs px-space-lg py-3 rounded-xl bg-surface-container-low text-on-surface font-headline-sm text-headline-sm shadow-xs hover:bg-surface-container-high transition-colors">
                  Explore Problems
                  <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                </a>
                <a href="#impact" className="inline-flex items-center gap-1 text-tertiary font-label-lg text-label-lg hover:underline py-2">
                  View 2024 Impact Report
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              </div>
              {/* Trust badges */}
              <div className="pt-space-md flex flex-wrap items-center gap-space-lg text-on-surface-variant">
                {[
                  { icon: 'verified', text: 'Govt-Recognized NCIF Pilot Node' },
                  { icon: 'security', text: 'RTI Transparency Compliant' },
                  { icon: 'handshake', text: 'MCA Sec. 135 CSR Audited' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
                    <span className="font-label-md text-label-md">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: 5-Node Pipeline card */}
            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest rounded-xl shadow-xl p-space-lg space-y-space-md">
                <div className="flex items-center justify-between pb-space-sm">
                  <div>
                    <p className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Algorithmic Lifecycle</p>
                    <h3 className="font-headline-md text-headline-md text-on-surface">The 5-Node Setu Pipeline</h3>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-code text-code text-xs">v3.4 Production</span>
                </div>
                <div className="space-y-space-xs">
                  {PIPELINE_STEPS.map((step, i) => (
                    <React.Fragment key={step.n}>
                      <div className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container flex items-start gap-space-sm transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-headline-sm text-headline-sm shrink-0 ${step.active ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-primary'}`}>
                          {step.n}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-headline-sm text-headline-sm text-on-surface">{step.title}</h4>
                            <span className={`font-label-caps text-label-caps px-2 py-0.5 rounded-full text-[10px] ${step.active ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'}`}>{step.tag}</span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{step.desc}</p>
                        </div>
                      </div>
                      {i < PIPELINE_STEPS.length - 1 && <div className="h-3 w-0.5 bg-outline-variant/60 ml-7" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── How TriSetu Works ──────────────────────────────────────────── */}
        <section className="w-full py-space-2xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-surface-container-low">
          <div className="max-w-max-width mx-auto">
            <div className="text-center mb-space-2xl">
              <p className="font-label-caps text-label-caps text-primary uppercase tracking-wider mb-space-sm">Process Architecture</p>
              <h2 className="font-headline-xl text-headline-xl text-on-surface">How TriSetu Works</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mt-space-sm">A structured, auditable mechanism moving civic grievances from community frustration to academically engineered and funded civic action.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              {HOW_STEPS.map((step) => (
                <div key={step.step} className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs">
                  <div className="flex items-center gap-space-sm mb-space-md">
                    <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">{step.icon}</span>
                    </div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Release {step.step}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">{step.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Quad-Helix Alliance ────────────────────────────────────────── */}
        <section className="w-full py-space-2xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="max-w-max-width mx-auto">
            <div className="text-center mb-space-2xl">
              <p className="font-label-caps text-label-caps text-primary uppercase tracking-wider mb-space-sm">The Locomotive Flywheel</p>
              <h2 className="font-headline-xl text-headline-xl text-on-surface">The Quad-Helix Alliance</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mt-space-sm">Every stakeholder pillar has dedicated tooling, incentives, and operational dashboards built right into the platform.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              {STAKEHOLDERS.map((s) => (
                <div key={s.label} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                  <div className={`p-space-md ${s.bg} border-b border-outline-variant/20`}>
                    <span className={`material-symbols-outlined text-3xl ${s.color}`}>{s.icon}</span>
                    <h3 className={`font-headline-sm text-headline-sm ${s.color} mt-space-xs`}>{s.label}</h3>
                  </div>
                  <div className="p-space-md">
                    <ul className="space-y-space-xs mb-space-md">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">check_circle</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link to={s.to} className={`block text-center py-2 rounded-lg font-label-lg text-label-lg ${s.color} border border-current hover:bg-surface-container-low transition-colors`}>
                      {s.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Live Problems Feed ──────────────────────────────────────────── */}
        <section id="problems" className="w-full py-space-2xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-surface-container-low">
          <div className="max-w-max-width mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl">
              <div>
                <p className="font-label-caps text-label-caps text-primary uppercase tracking-wider mb-space-xs">Aggregated Collection</p>
                <h2 className="font-headline-xl text-headline-xl text-on-surface">Live Community Problems</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Directly crowdsourced from wards across the country, filtered by urgency, verification, and engineering domain.</p>
              </div>
              <div className="flex gap-space-xs mt-space-md md:mt-0 flex-wrap">
                {['All Problems', 'Urban Plans', 'Habitats', 'Agritech'].map((f, i) => (
                  <button key={f} className={`px-space-md py-1.5 rounded-full font-label-md text-label-md ${i === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'} transition-colors`}>{f}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {SAMPLE_PROBLEMS.map((p, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className={`px-2.5 py-0.5 rounded-full font-label-caps text-label-caps text-[10px] ${p.cat_color}`}>{p.category}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">{p.status}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">{p.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mb-space-md text-[11px]">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {p.loc}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant text-[11px]">
                      <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                      {p.upvotes} Upvotes
                    </div>
                    <Link to="/login" className="font-label-lg text-label-lg text-primary hover:underline text-[12px]">Review Open →</Link>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA box */}
            <div className="mt-space-xl bg-primary/5 rounded-xl p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md border border-primary/20">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Notice a systemic problem in your neighborhood?</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Be the first to report it, and it automatically enters an engineering mesh civic problem in 60 seconds.</p>
              </div>
              <Link to="/register" className="px-space-lg py-3 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm shadow-md hover:bg-primary-container transition-all whitespace-nowrap">
                + Submit Ward Problem
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Impact Statistics ───────────────────────────────────────────── */}
        <section id="impact" className="w-full py-space-2xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="max-w-max-width mx-auto">
            <div className="text-center mb-space-xl">
              <p className="font-label-caps text-label-caps text-primary uppercase tracking-wider mb-space-xs">What We've Built Together</p>
              <h2 className="font-headline-xl text-headline-xl text-on-surface">National Impact Statistics</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Measured, audited, and immutable records across urban local bodies and rural panchayats.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-space-lg">
              {IMPACT_STATS.map(({ value, label, sub, icon }) => (
                <div key={label} className="bg-surface-container-lowest rounded-xl p-space-lg text-center shadow-xs">
                  <span className="material-symbols-outlined text-primary text-3xl block mb-space-sm">{icon}</span>
                  <p className="font-headline-lg text-headline-lg text-on-surface font-bold">{value}</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mt-1 text-[10px]">{label}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA ───────────────────────────────────────────────────── */}
        <section className="w-full bg-inverse-surface py-space-2xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="max-w-max-width mx-auto flex flex-col lg:flex-row items-center justify-between gap-space-xl">
            <div>
              <p className="font-label-caps text-label-caps text-inverse-primary uppercase tracking-wider mb-space-sm">Contributing Organization</p>
              <h2 className="font-headline-xl text-headline-xl text-inverse-on-surface mb-space-sm">
                Ready to bridge the gap in your local municipal zone?
              </h2>
              <p className="font-body-lg text-body-lg text-inverse-on-surface/70">
                Whether you're a citizen demanding cleaner water, a university research lab seeking real-world challenges, or a CSR director deploying machinery capital — TriSetu provides the transparent highway.
              </p>
            </div>
            <div className="flex flex-col gap-space-sm min-w-[220px]">
              <Link to="/register" className="px-space-lg py-3 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm shadow-md hover:bg-primary-container transition-all text-center">
                + Submit a Civic Problem
              </Link>
              <Link to="/register" className="px-space-lg py-3 rounded-xl bg-inverse-on-surface/10 text-inverse-on-surface font-headline-sm text-headline-sm border border-inverse-on-surface/20 hover:bg-inverse-on-surface/20 transition-all text-center">
                Partner as University / CSR
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Footer ──────────────────────────────────────────────────────── */}
        <footer className="w-full bg-inverse-surface border-t border-inverse-on-surface/10 py-space-xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="max-w-max-width mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-space-xl mb-space-xl">
              <div>
                <div className="flex items-center gap-space-sm mb-space-md">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-on-primary font-bold text-sm">TS</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-inverse-on-surface">TriSetu</span>
                </div>
                <p className="font-body-sm text-body-sm text-inverse-on-surface/60">Bridging Citizens, Government, Universities, and Industry in collaborative civic action.</p>
              </div>
              {[
                { title: 'Constituencies', links: ['Citizen Reports', 'University Consortium', 'CSR Partnerships', 'Government Portal'] },
                { title: 'Standards & Ethics', links: ['Audit Trail Policy', 'Data Privacy RTI', 'CSR Compliance', 'Academic Ethics Board'] },
                { title: 'National Report', links: ['2024 Impact Report', 'NCIF Documentation', 'Open Data Exports', 'Press Kit'] },
              ].map(({ title, links }) => (
                <div key={title}>
                  <h4 className="font-label-lg text-label-lg text-inverse-on-surface mb-space-md">{title}</h4>
                  <ul className="space-y-space-xs">
                    {links.map((l) => (
                      <li key={l}><a href="#" className="font-body-sm text-body-sm text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors">{l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-inverse-on-surface/10 pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
              <div className="flex flex-wrap items-center gap-space-lg">
                {[
                  { icon: 'gavel', text: 'Right to Information (RTI)' },
                  { icon: 'dataset', text: 'Open Data Mandate' },
                  { icon: 'policy', text: 'Ministry Alignment' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
                    <span className="font-label-md text-label-md text-inverse-on-surface/70">{text}</span>
                  </div>
                ))}
              </div>
              <p className="font-body-sm text-body-sm text-inverse-on-surface/40">© 2025 TriSetu Platform | Engineering-Enabled Civic Association. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
