import cds from "@sap/cds";
import { Events, Event, Users, EventLikes } from "#cds-models/EventsService";

export class EventsService extends cds.ApplicationService {
  init() {
    const { like } = Event.actions;

    this.on(like, async (req) => {
      const [ID] = req.params;
      const { id } = req.user;
      const user = await SELECT.one
        .from(Users)
        .columns("ID")
        .where({ email: id });
      if (user)
        return await INSERT({ user_ID: user?.ID, event_ID: ID }).into(
          EventLikes
        );
      return req.error(404, "User not found!");
    });

    this.on("READ", Event, async (req, next) => {
      const [ID] = req.params;
      await UPDATE(Events, ID).with({ views: { "+=": 1 } });
      return next();
    });

    return super.init();
  }
}
