import React from 'react';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, children, footer, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/30">{footer}</div>}
    </div>
  );
};
