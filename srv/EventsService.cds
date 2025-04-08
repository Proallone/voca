using {events as evt} from '../db/schema';
using {sap.common as cm} from '@sap/cds-common-content';


service EventsService {
    entity Events as projection on evt.Events 
    actions{
        action like();
        action attend();
    };
    entity Comments as projection on evt.Comments;
    entity Users    as projection on evt.Users;
    entity Labels   as projection on evt.Labels;
    entity Notifications as projection on evt.Notifications;
    entity Country  as projection on cm.Countries;

    event EventCreated {
        event_ID: UUID;
    }
// entity EventAttendees as projection on evt.EventAttendees;
};
