import { useState, useEffect } from 'react';

export interface CivicEvent {
  id: string;
  type:
    | 'PROBLEM_LOGGED'
    | 'MANDATE_ASSIGNED'
    | 'PROPOSAL_SUBMITTED'
    | 'PROPOSAL_APPROVED'
    | 'GRANT_COMMITTED'
    | 'MILESTONE_COMPLETED'
    | 'SOCIAL_AUDIT_CERTIFIED';
  title: string;
  message: string;
  timestamp: string;
  payload?: any;
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://trisetubackend-production.up.railway.app/api/v1'
    : 'http://localhost:5000/api/v1');

export function useRealtimeTelemetry() {
  const [connected, setConnected] = useState<boolean>(false);
  const [events, setEvents] = useState<CivicEvent[]>([]);
  const [latestEvent, setLatestEvent] = useState<CivicEvent | null>(null);

  useEffect(() => {
    let es: EventSource | null = null;
    let reconnectTimeout: any = null;

    const connect = () => {
      try {
        es = new EventSource(`${API_BASE}/events/stream`);

        es.addEventListener('connected', () => {
          setConnected(true);
        });

        es.addEventListener('civic_event', (e: MessageEvent) => {
          try {
            const data: CivicEvent = JSON.parse(e.data);
            setLatestEvent(data);
            setEvents((prev) => [data, ...prev.slice(0, 24)]);

            // Dispatch global event for silent query invalidation
            window.dispatchEvent(new CustomEvent('samadhan:telemetry', { detail: data }));
          } catch {
            // ignore parse error
          }
        });

        es.onerror = () => {
          setConnected(false);
          es?.close();
          // Auto-reconnect after 3.5s
          reconnectTimeout = setTimeout(connect, 3500);
        };
      } catch {
        setConnected(false);
      }
    };

    connect();

    return () => {
      es?.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  return { connected, events, latestEvent };
}
