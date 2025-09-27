import cds, { type csn } from "@sap/cds";
import nodemailer from "nodemailer";
import { sendEventEmails, Event, Users } from "#cds-models/MailingService";
import { promises } from "fs";
import path from "path";
import type { ServiceOptions } from "./types/Service";
import { MailOptions } from "nodemailer/lib/json-transport";
// TODO consider using worker for sending emails

export class MailingService extends cds.ApplicationService {
  private transporter: nodemailer.Transporter;

  constructor(name: string, model: csn.CSN, options: ServiceOptions) {
    super(name, model, options);
    this.transporter = nodemailer.createTransport({
      host: process.env.smtp_host,
      port: Number(process.env.smtp_port),
    });
  }

  init() {
    this.on(sendEventEmails, async (req) => {
      const { eventID } = req.data;
      const event = await SELECT.one(Event, eventID!);

      if (!event) return req.error(500, "Something went wrong!");

      const users = await this.getEmailSubscribers();
      const templatePath = path.join(__dirname, "mails", "new_event.html");
      const htmlTemplate = await this.readEmailTemplate(templatePath);

      const emails = this.prepareEmails(users, event, htmlTemplate);

      try {
        await Promise.all(emails);
        return true;
      } catch (err) {
        console.error(`An error occured during email sending...`, err); //todo better handling required
        return false;
      }
    });

    return super.init();
  }

  private prepareEmails(users: Users, event: Event, template: string) {
    const emails: Promise<MailOptions>[] = [];

    for (const user of users) {
      const compiledHtml = template
        .replace("{{userName}}", user.name!)
        .replaceAll("{{eventName}}", event.name!)
        .replace("{{eventDate}}", new Date(event.start_date!).toDateString())
        .replace("{{eventImageURL}}", event.image_url!);

      const mail: MailOptions = {
        from: "sender@events.com",
        to: user.email!,
        subject: `Event ${event?.name} is happening on ${new Date(
          event?.start_date!
        ).toDateString()}!`,
        html: compiledHtml,
      };

      emails.push(this.transporter.sendMail(mail));
    }
    return emails;
  }

  private async readEmailTemplate(path: string) {
    return await promises.readFile(path, "utf8");
  }

  private async getEmailSubscribers() {
    return await SELECT.from(Users)
      .columns("name", "email")
      .where({ email_subscription: true });
  }
}
