import React, { useState, useEffect } from 'react';
import { useRealtimeTelemetry, CivicEvent } from '../../hooks/useRealtimeTelemetry';

export const LiveTelemetryToaster: React.FC = () => {
  const { connected, latestEvent } = useRealtimeTelemetry();
  const [activeToast, setActiveToast] = useState<CivicEvent | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (latestEvent) {
      setActiveToast(latestEvent);
      const timer = setTimeout(() => {
        setActiveToast((current) => (current?.id === latestEvent.id ? null : current));
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [latestEvent]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'GRANT_COMMITTED':
        return 'payments';
      case 'SOCIAL_AUDIT_CERTIFIED':
        return 'verified';
      case 'MANDATE_ASSIGNED':
        return 'school';
      case 'PROPOSAL_SUBMITTED':
      case 'PROPOSAL_APPROVED':
        return 'task_alt';
      case 'MILESTONE_COMPLETED':
        return 'flag';
      default:
        return 'sensors';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 pointer-events-none max-w-sm w-full">
      {/* Real-time Telemetry Toast */}
      {activeToast && (
        <div className="pointer-events-auto w-full bg-surface-container-lowest/95 backdrop-blur-md border border-primary/30 rounded-2xl p-4 shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-container/30 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">{getIcon(activeToast.type)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Live Event • Just Now
                </span>
              </div>
              <h4 className="text-xs font-bold text-on-surface font-headline truncate mt-0.5">
                {activeToast.title}
              </h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2 mt-0.5">
                {activeToast.message}
              </p>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Floating Status Beacon Pill */}
      <div className="pointer-events-auto">
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant/30 text-[11px] font-semibold text-on-surface shadow-md hover:bg-surface-container-high transition-all"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              connected ? 'bg-success animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span>{connected ? 'Live Civic Telemetry' : 'Connecting to Mesh...'}</span>
          <span className="font-mono text-[9px] text-primary bg-primary-container/20 px-1.5 py-0.2 rounded-full">
            SSE 2.0
          </span>
        </button>
      </div>
    </div>
  );
};
