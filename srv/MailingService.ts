import cds from "@sap/cds";
import nodemailer from "nodemailer";
import { sentEventEmails, Event, Users } from "#cds-models/MailingService";
const fs = require("fs").promises;
const path = require("path");

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
      const templatePath = path.join(__dirname, "templates", "new_event.html");
      const htmlTemplate = await fs.readFile(templatePath, "utf8");
      
      const compiledHtml = htmlTemplate
        .replace("{{eventName}}", event?.name)
        .replace("{{eventDate}}", new Date(event?.start_date!).toDateString());

      for (const user of users) {
        transporter.sendMail({
          from: "sender@events.com",
          to: user.email!,
          subject: `Event ${event?.name} is happening on ${new Date(
            event?.start_date!
          ).toDateString()}!`,
          html: compiledHtml
        });
      }

      return true;
    });

    return super.init();
  }
}
