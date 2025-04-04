import cds from "@sap/cds";
import nodemailer from "nodemailer";
import { sentEventEmails, Event, Users } from "#cds-models/MailingService";

export class MailingService extends cds.ApplicationService {
  init() {
    const transporter = nodemailer.createTransport({
      host: "localhost",
      port: 1025,
    }); //TODO replace with destination

    this.on(sentEventEmails, async (req) => {
      const { eventID } = req.data;
      const event = await SELECT.one(Event, eventID!);
      const users = await SELECT.from(Users).columns("email");

      for (const user of users) {
        transporter.sendMail({
          from: "sender@events.com",
          to: user.email!,
          subject: `Event ${event?.name} is happening on ${new Date(
            event?.start_date!
          ).toDateString()}!`,
          html: `<p>${event?.name} is happening on ${new Date(
            event?.start_date!
          ).toDateString()}!</p> <p>Register now, if you do not want to miss it!</p>`,
        });
      }

      return true;
    });

    return super.init();
  }
}
