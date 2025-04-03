import cds from "@sap/cds";
import { Events, Event, Users, EventLikes, EventCreated } from "#cds-models/EventsService";

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

    this.after("CREATE", Events, async (res) => {
      this.emit(EventCreated, res?.ID)
    });

    this.on("READ", Event, async (req, next) => {
      const [ID] = req.params;
      await UPDATE(Events, ID).with({ views: { "+=": 1 } });
      return next();
    });

    this.on(EventCreated, (data)=>{
      const   ID : string   = data.data;
      console.info(`New event with ID ${ID} created!`);
      //TODO add implementation? maybe mailing?
    })

    return super.init();
  }
}
