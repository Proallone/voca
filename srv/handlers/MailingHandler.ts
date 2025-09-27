
import type { log } from "@sap/cds";
import { Event, Users } from "#cds-models/EventsService";
import { MailOptions } from "nodemailer/lib/json-transport";
import { Transporter } from "nodemailer";
import { promises } from "fs";
import path from "path";

export class MailingHandler {
    constructor(private readonly logger: typeof log.Logger, private readonly transporter: Transporter) { }

    public sendNewEventEmailsHander = async (eventID: string) => {
        const event = await SELECT.one(Event).where({ID: eventID});
        if (!event) throw new Error(`Event ${eventID} not found`);

        const users = await this.getEmailSubscribers();
        const templatePath = path.join(__dirname, "../mails", "new_event.html");
        const htmlTemplate = await this.readEmailTemplate(templatePath);

        const emails = this.prepareEmails(users, event, htmlTemplate);

        try {
            await Promise.all(emails);
            return true;
        } catch (err) {
            console.error(`An error occured during email sending...`, err); //todo better handling required
            return false;
        }
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