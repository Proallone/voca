import cds, { type csn } from "@sap/cds";
import nodemailer from "nodemailer";
import { sendEventEmails, Event, Users } from "#cds-models/MailingService";
import { promises } from "fs";
import path from "path";
import Mail from "nodemailer/lib/mailer";
import type { ServiceOptions } from "./types/Service";
export class MailingService extends cds.ApplicationService {
  private smtp_host: string;
  private smtp_port: number;
  private transporter: nodemailer.Transporter;

  constructor(name: string, model: csn.CSN, options: ServiceOptions) {
    super(name, model, options);
    this.smtp_host = process.env.smtp_host!;
    this.smtp_port = Number(process.env.smtp_port!);
    this.transporter = nodemailer.createTransport({
      host: this.smtp_host,
      port: this.smtp_port,
    });
  }

  init() {
    this.on(sendEventEmails, async (req) => {
      const { eventID } = req.data;
      const event = await SELECT.one(Event, eventID!);
      const users = await SELECT.from(Users).columns("email");
      const templatePath = path.join(__dirname, "mails", "new_event.html");
      const htmlTemplate = await this.readEmailTemplate(templatePath);

      const compiledHtml = htmlTemplate
        .replace("{{eventName}}", event?.name!)
        .replace("{{eventDate}}", new Date(event?.start_date!).toDateString())
        .replace("{{eventImageURL}}", event?.image_url!);

      for (const user of users) {
        this.transporter.sendMail({
          from: "sender@events.com",
          to: user.email!,
          subject: `Event ${event?.name} is happening on ${new Date(
            event?.start_date!
          ).toDateString()}!`,
          html: compiledHtml,
        });
      }

      return true;
    });

    return super.init();
  }

  private async readEmailTemplate(path: string) {
    return await promises.readFile(path, "utf8");
  }

  private sendEmailToUsers(users: Users, email: Mail) {
    for (const user of users) {
      this.transporter.sendMail(email);
    }
  }
}
