import React from 'react';

const FOOTER_LINKS = [
  { label: 'About Samadhan AI', href: '/about' },
  { label: 'Policies', href: '/policies' },
  { label: 'Contact', href: '/contact' },
  { label: 'Grievance', href: '/grievance' },
];

const Footer: React.FC = () => {
  return (
    <footer
      style={styles.footer}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div style={styles.inner}>
        <p style={styles.copy}>
          © {new Date().getFullYear()} Samadhan AI — Digital Public Infrastructure
          for Civic Innovation &amp; Research Alliances.
        </p>

        <nav aria-label="Footer navigation" style={styles.links}>
          {FOOTER_LINKS.map((link, i) => (
            <React.Fragment key={link.label}>
              {i > 0 && <span style={styles.separator} aria-hidden="true">|</span>}
              <a
                href={link.href}
                style={styles.link}
                id={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </a>
            </React.Fragment>
          ))}
        </nav>
      </div>
    </footer>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footer: {
    background: '#f9fafb',
    borderTop: '1px solid #e5e7eb',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
  },
  copy: {
    margin: 0,
    fontSize: '0.8125rem',
    color: '#6b7280',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  separator: {
    color: '#d1d5db',
    fontSize: '0.75rem',
  },
  link: {
    fontSize: '0.8125rem',
    color: '#374151',
    textDecoration: 'none',
  },
};

export default Footer;
