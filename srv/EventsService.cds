using {events as evt} from '../db/schema';
using {sap.common as cm} from '@sap/cds-common-content';


service EventsService {
    entity Events as projection on evt.Events;
    entity Comments as projection on evt.Comments;
    entity Users    as projection on evt.Users;
    entity Labels   as projection on evt.Labels;
    entity Country  as projection on cm.Countries;
// entity EventAttendees as projection on evt.EventAttendees;
};
