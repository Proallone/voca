import cds from "@sap/cds";
import { Events, Event } from "#cds-models/EventsService";

export class EventsService extends cds.ApplicationService {
  init() {
    this.on("READ", Event, async (req, next) => {
      const [ID] = req.params;
      await UPDATE(Events, ID).with({ views: { "+=": 1 } });
      return next();
    });

    return super.init();
  }
}
