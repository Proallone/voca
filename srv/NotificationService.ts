import cds from "@sap/cds";
import { sendNotification } from "#cds-models/NotificationService";
import { NotificationHandler } from "./handlers/NotificationHandler";

export class NotificationService extends cds.ApplicationService {

    async init() {
        const logger = cds.log(this.name);

        const handler = new NotificationHandler(logger);

        this.on(sendNotification, async (req) => {
            const { eventID } = req.data;
            await handler.sendNewEventNotificationHandler(eventID!!);
            return req.info(200, `Notifications sent for event ID ${eventID}`);
        });

        return super.init();
    }
}
