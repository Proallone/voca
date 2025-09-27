
import type { log } from "@sap/cds";
import { Users } from "#cds-models/EventsService";
import { Events, Notification, Notifications } from "#cds-models/NotificationService";


export class NotificationHandler {
    constructor(private readonly logger: typeof log.Logger) { }

    public sendNewEventNotificationHandler = async (eventID: string) => {
        const users = await SELECT.from(Users).where({ notification_subscription: true });
        const event = await SELECT.one.from(Events).where({ID: eventID});

        const newNotif: Notification[] = [];

        //TODO this is a placeholder
        for (const user of users) {
            const notification: Notification = {
                title: `New event ${event?.name}`,
                description: `${event?.description}`,
                user_ID: user.ID,
                type: "Notification"
            }
            newNotif.push(notification)
        };

        await INSERT.into(Notifications).entries(newNotif);
    }
}