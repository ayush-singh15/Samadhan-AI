import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
}) => (
  <div
    style={{
      textAlign: 'center',
      padding: '3rem 1.5rem',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}
  >
    <div
      style={{
        width: '48px',
        height: '48px',
        background: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: '50%',
        margin: '0 auto 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden="true"
    >
      <span style={{ fontSize: '1.25rem', color: '#9ca3af' }}>○</span>
    </div>
    <p style={{ fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
      {title}
    </p>
    {description && (
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.25rem' }}>
        {description}
      </p>
    )}
    {action}
  </div>
);

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading…',
}) => (
  <div
    style={{
      textAlign: 'center',
      padding: '3rem 1.5rem',
      color: '#6b7280',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '0.9375rem',
    }}
    aria-live="polite"
    aria-busy="true"
  >
    {message}
  </div>
);

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong while loading this information. Please try again.',
  onRetry,
}) => (
  <div
    role="alert"
    style={{
      padding: '1rem 1.25rem',
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderLeft: '3px solid #b91c1c',
      borderRadius: '4px',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '0.875rem',
      color: '#7f1d1d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap' as const,
    }}
  >
    <span>{message}</span>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          padding: '0.375rem 0.875rem',
          background: 'transparent',
          border: '1px solid #fecaca',
          borderRadius: '3px',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: '#b91c1c',
          cursor: 'pointer',
          flexShrink: 0,
          fontFamily: 'inherit',
        }}
      >
        Retry
      </button>
    )}
  </div>
);
