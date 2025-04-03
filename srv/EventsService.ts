import cds from "@sap/cds";
import {
  Events,
  Event,
  Users,
  EventLikes,
  EventCreated,
} from "#cds-models/EventsService";

import nodemailer from "nodemailer";

export class EventsService extends cds.ApplicationService {
  init() {
    const { like } = Event.actions;

    const transporter = nodemailer.createTransport({
      host: "localhost",
      port: 1025,
    });

    this.on(like, async (req) => {
      const [eventID] = req.params;
      const { id: userEmail } = req.user;
      const user = await SELECT.one
        .from(Users)
        .columns("ID")
        .where({ email: userEmail });

      if (!user) return req.error(404, "User not found!");

      return await INSERT({ user_ID: user?.ID, event_ID: eventID }).into(
        EventLikes
      );
    });

    this.after("CREATE", Events, async (res) => {
      this.emit(EventCreated, res?.ID);
    });

    this.on("READ", Event, async (req, next) => {
      const [ID] = req.params;
      await UPDATE(Events, ID).with({ views: { "+=": 1 } });
      return next();
    });

    this.on(EventCreated, async (req) => {
      const eventID: string = req.data;
      console.info(`New event with ID ${eventID} created!`);
      //TODO add implementation? maybe mailing? notification?
      const event = await SELECT.one(Event, eventID);
      const users = await SELECT.from(Users).columns("email");

      for(const user of users) {
        transporter.sendMail({
          from: "sender@events.com",
          to: user.email!,
          subject: `Event ${event?.name} is happening soon!`,
          html: "Hello from CAP application",
        });
      }
    });

    return super.init();
  }
}
