import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">{label}</label>}
        <input
          ref={ref}
          className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
            error ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-600'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-rose-500">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
