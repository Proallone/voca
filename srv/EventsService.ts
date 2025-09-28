import type { ExpressRequest } from "./types/Service";
import cds from "@sap/cds";
import {
  Events,
  Event,
  EventCreated,
} from "#cds-models/EventsService";
import MailingService from "#cds-models/MailingService";
import NotificationService from "#cds-models/NotificationService";
import { EventsHandler } from "./handlers/EventsHandler";

export class EventsService extends cds.ApplicationService {
  async init() {
    const { like, attend, generateIcs } = Event.actions;

    const logger = cds.log(this.name);

    const mailingService = await cds.connect.to(MailingService);
    const notificationService = await cds.connect.to(NotificationService);
    const handler = new EventsHandler(logger, mailingService, notificationService);

    this.on(like, async (req) => {
      const [event] = req.params;
      const { id: userEmail } = req.user;
      await handler.likeHandler(event.ID, userEmail);
      return req.info(201, `Event with ID ${event.ID} liked successfully by ${userEmail}`);
    });

    this.on(attend, async (req) => {
      const [event] = req.params;
      const { id: userEmail } = req.user;
      await handler.attendHandler(event.ID, userEmail);
      return req.info(201, `Event with ID ${event.ID} attended successfully by ${userEmail}`);
    });

    this.on(generateIcs, async (_req) => {
      const req = _req as ExpressRequest; 
      const { res, params } = req;
      const ics = await handler.generateIcsHandler(params[0].ID);
      res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="event_${params[0].ID}.ics"`);
      return res.send(ics); //? we send as a plain express response to omit cds context property (breaks the response content)
    });

    this.after("CREATE", Events, async (res) => {
      this.emit(EventCreated, res?.ID);
    });

    this.on("READ", Event, async (req, next) => {
      const [event] = req.params;
      if (event) { //if entire entity is read then this is undefined
        await handler.eventReadHandler(event.ID);
      }
      return next();
    });

    this.on(EventCreated, async (req) => {
      const eventID: string = req.data;
      // const hostID: string = req.user.id;
      await handler.eventCreatedHandler(eventID);
    });

    return super.init();
  }
}