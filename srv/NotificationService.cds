using {events as evt} from '../db/schema';

service NotificationService {
    entity Notifications as projection on evt.Notifications;
    entity Events        as projection on evt.Events;
    entity Users         as projection on evt.Users;
    function sendNotification(eventID: UUID) returns Boolean;
};
