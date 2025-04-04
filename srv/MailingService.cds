using {events as evt} from '../db/schema';


service MailingService {
    entity Events as projection on evt.Events;
    entity Users as projection on evt.Users;
    function sentEventEmails(eventID : UUID) returns Boolean;
};
