import cds from "@sap/cds";
import { Events, Event } from "#cds-models/EventsService";

export class EventsService extends cds.ApplicationService {
  init() {
    this.after("READ", Event, async (res, req) => {
      const [ID] = req.params;
      await UPDATE(Events, ID).with({ views: { "+=": 1 } });
    });

    return super.init();
  }
}
