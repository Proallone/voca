import type MailingService from "#cds-models/MailingService";
import type NotificationService from "#cds-models/NotificationService";
import type { CDSService } from "../types/Service";
import { EventAttendees, EventLikes, Events, Users } from "#cds-models/EventsService";
import { sendEventEmails } from "#cds-models/MailingService";
import { sendNotification } from "#cds-models/NotificationService";
import type { log } from "@sap/cds";
import path from "path";
import { compileTemplate } from "../utils/compileTemplate";

export class EventsHandler {
    constructor(private readonly logger: typeof log.Logger, private readonly mailingService: CDSService<MailingService>, private readonly notificationService: CDSService<NotificationService>) { }

    public likeHandler = async (eventID: string, userEmail: string) => {
        const user = await SELECT.one
            .from(Users)
            .columns("ID")
            .where({ email: userEmail });

        if (!user) throw new Error("User not found"); //TODO add better error types

        const alreadyLiked = await SELECT.one.from(EventLikes).where({ event_ID: eventID, user_ID: user.ID });

        if (alreadyLiked) throw new Error("Event already liked"); //TODO add better error types

        await INSERT({ user_ID: user?.ID, event_ID: eventID }).into(
            EventLikes
        );
    }

    public attendHandler = async (eventID: string, userEmail: string) => {
        const user = await SELECT.one
            .from(Users)
            .columns("ID")
            .where({ email: userEmail });

        if (!user) throw new Error("User not found"); //TODO add better error types

        const alreadyAttending = await SELECT.one.from(EventAttendees).where({ event_ID: eventID, user_ID: user.ID });

        if (alreadyAttending) throw new Error("Event already attended"); //TODO add better error types

        await INSERT({ user_ID: user?.ID, event_ID: eventID }).into(
            EventAttendees
        );
    }

    public generateIcsHandler = async (eventID: string) => {
        const filePath = path.join(path.resolve(__dirname, "../"), "templates/calendars", `event.ics.hbs`);
        const template = compileTemplate(filePath);
        const data = {
            uid: "12345@example.com",
            dtstamp: "20250927T120000Z",
            dtstart: "20251001T090000Z",
            dtend: "20251001T100000Z",
            summary: "Team Meeting",
            description: "Discuss Q4 roadmap",
            location: "Conference Room A"
        };
        const ics = template(data);
        return ics;
    }

    public eventReadHandler = async (eventID: string) => {
        await UPDATE(Events).with({ views: { "+=": 1 } }).where({ ID: eventID });
    }

    public eventCreatedHandler = async (eventID: string) => {
        await this.mailingService.send(sendEventEmails, { eventID: eventID });
        await this.notificationService.send(sendNotification, { eventID: eventID });
        this.logger.log(`Notifications and emails sent for new event ${eventID}`);
    }
}