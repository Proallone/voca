import cds from "@sap/cds";
import { sendNotification, Users, Notification, Notifications, Events } from "#cds-models/NotificationService";

export class NotificationService extends cds.ApplicationService {

    init() {

        this.on(sendNotification, async (req) => {
            const { eventID } = req.data;

            const users = await SELECT.from(Users).where({ notification_subscription: true });
            const event = await SELECT.one.from(Events, eventID!);

            const newNotif: Notification[] = [];

            //TODO this is a placeholder
            for (const user of users) {
                newNotif.push({
                    title: `New event ${event?.name}`,
                    description: `${event?.description}`,
                    user_ID: user.ID,
                    type: "Notification"
                } as Notification)
            };

            await INSERT.into(Notifications).entries(newNotif);
            return true;
        });

        return super.init();
    }
}
