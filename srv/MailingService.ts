import cds from "@sap/cds";
import nodemailer from "nodemailer";
import { sendEventEmails, Event, Users } from "#cds-models/MailingService";
const fs = require("fs").promises;
const path = require("path");

export class MailingService extends cds.ApplicationService {
  init() {
    const { stmp_host, smtp_port } = process.env;

    const transporter = nodemailer.createTransport({
      host: stmp_host,
      port: Number(smtp_port),
    }); //TODO replace with destination

    this.on(sendEventEmails, async (req) => {
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
