import type { log } from "@sap/cds";
import { Event, Users } from "#cds-models/EventsService";
import { MailOptions } from "nodemailer/lib/json-transport";
import { Transporter } from "nodemailer";
import path from "path";
import { compileTemplate } from "../utils/compileTemplate";

export class MailingHandler {
    constructor(private readonly logger: typeof log.Logger, private readonly transporter: Transporter) { }

    public sendNewEventEmailsHander = async (eventID: string) => {
        const event = await SELECT.one(Event).where({ ID: eventID });
        if (!event) throw new Error(`Event ${eventID} not found`);

        const users = await this.getEmailSubscribers();
        const filePath = path.join(path.resolve(__dirname, "../"), "templates/emails", `new_event.hbs`);
        const template = compileTemplate(filePath);

        const emails = this.prepareEmails(users, event, template);

        try {
            await Promise.all(emails);
            return true;
        } catch (err) {
            console.error(`An error occured during email sending...`, err); //todo better handling required
            return false;
        }
    }

    private prepareEmails(users: Users, event: Event, template: HandlebarsTemplateDelegate<any>) {
        const emails: Promise<MailOptions>[] = [];

        for (const user of users) {
            const data = {
                userName: user.name!,
                eventName: event.name!,
                eventDate: new Date(event.start_date!).toDateString(),
                eventImageURL: event.image_url!
            }

            const html = template(data);
            const mail: MailOptions = {
                from: "sender@events.com",
                to: user.email!,
                subject: `Event ${event?.name} is happening on ${new Date(
                    event?.start_date!
                ).toDateString()}!`,
                html: html,
            };

            emails.push(this.transporter.sendMail(mail));
        }
        return emails;
    }

    private async getEmailSubscribers() {
        return await SELECT.from(Users)
            .columns("name", "email")
            .where({ email_subscription: true });
    }
}