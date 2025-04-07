import cds, { type csn } from "@sap/cds";
import nodemailer from "nodemailer";
import { sendEventEmails, Event, Users } from "#cds-models/MailingService";
import { promises } from "fs";
import path from "path";
import type { ServiceOptions } from "./types/Service";
import { MailOptions } from "nodemailer/lib/json-transport";
// TODO consider using worker for sending emails

import { performance } from "perf_hooks";
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
      const start = performance.now();
      const { eventID } = req.data;
      const event = await SELECT.one(Event, eventID!);

      if (!event) return req.error(500, "Something went wrong!");

      const users = await this.getEmailSubscribers();
      const templatePath = path.join(__dirname, "mails", "new_event.html");
      const htmlTemplate = await this.readEmailTemplate(templatePath);

      const proms: Promise<any>[] = [];

      for (const user of users) {
        const compiledHtml = htmlTemplate
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

        proms.push(this.transporter.sendMail(mail));
      }
      
      await Promise.all(proms);

      const end = performance.now();
      console.log(`Time taken ${(end - start) / 1000}s`);
      return true;
    });

    return super.init();
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
