import cds from "@sap/cds";
import {
  Events,
  Event,
  Users,
  EventLikes,
  EventCreated,
} from "#cds-models/EventsService";
import MailingService, { sendEventEmails} from "#cds-models/MailingService";
export class EventsService extends cds.ApplicationService {
  init() {
    const { like } = Event.actions;


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

      const mailService = await cds.connect.to(MailingService);
      const res : Boolean = await mailService.send(sendEventEmails, { eventID: eventID })

    });

    return super.init();
  }
}