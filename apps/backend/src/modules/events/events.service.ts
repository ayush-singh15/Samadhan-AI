import { Response } from 'express';
import { randomUUID } from 'crypto';

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

export class EventsService {
  private clients: Set<Response> = new Set();
  private recentEvents: CivicEvent[] = [
    {
      id: 'init-1',
      type: 'GRANT_COMMITTED',
      title: 'CSR Escrow Locked',
      message: 'Tata Trusts committed ₹38.5 Lakhs in smart escrow for Varanasi Water Monitoring.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: 'init-2',
      type: 'PROPOSAL_APPROVED',
      title: 'Engineering Mandate Activated',
      message: 'IIT Kanpur proposal for Lucknow Waste Management approved with 3 milestone tranches.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: 'init-3',
      type: 'SOCIAL_AUDIT_CERTIFIED',
      title: 'Community Social Audit',
      message: 'Assi Ghat community certified sensor telemetry deployed at 5.0/5.0 stars.',
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    },
  ];

  addClient(res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    this.clients.add(res);

    res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', time: new Date().toISOString() })}\n\n`);

    this.recentEvents.forEach((ev) => {
      res.write(`event: civic_event\ndata: ${JSON.stringify(ev)}\n\n`);
    });

    const heartbeat = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, 20000);

    res.on('close', () => {
      clearInterval(heartbeat);
      this.clients.delete(res);
    });
  }

  broadcast(eventData: Omit<CivicEvent, 'id' | 'timestamp'>) {
    const event: CivicEvent = {
      ...eventData,
      id: randomUUID(),
      timestamp: new Date().toISOString(),
    };

    this.recentEvents.unshift(event);
    if (this.recentEvents.length > 25) {
      this.recentEvents.pop();
    }

    const payloadString = `event: civic_event\ndata: ${JSON.stringify(event)}\n\n`;

    this.clients.forEach((client) => {
      try {
        client.write(payloadString);
      } catch {
        this.clients.delete(client);
      }
    });

    return event;
  }

  getRecentEvents(): CivicEvent[] {
    return this.recentEvents;
  }
}

export const eventsService = new EventsService();
