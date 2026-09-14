import { Request, Response } from 'express';
import { eventsService } from './events.service';
import { sendResponse } from '../../utils/response';

export class EventsController {
  stream(req: Request, res: Response) {
    eventsService.addClient(res);
  }

  getRecent(req: Request, res: Response) {
    const list = eventsService.getRecentEvents();
    return sendResponse(res, 200, true, 'Recent telemetry events', list);
  }
}

export const eventsController = new EventsController();
