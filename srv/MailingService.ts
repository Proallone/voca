import cds from "@sap/cds";
import { createTransport } from "nodemailer";
import { sendEventEmails } from "#cds-models/MailingService";
import { MailingHandler } from "./handlers/MailingHandler";
// TODO consider using worker for sending emails

export class MailingService extends cds.ApplicationService {

  async init() {
    const logger = cds.log(this.name);

    const transporter = createTransport({
      host: process.env.smtp_host,
      port: Number(process.env.smtp_port),
    });

    const handler = new MailingHandler(logger, transporter);

    this.on(sendEventEmails, async (req) => {
      const { eventID } = req.data;
      await handler.sendNewEventEmailsHander(eventID!!);
    });

    return super.init();
  }
}
