using {events as evt} from '../db/schema';

service EventsService {
    entity Events         as projection on evt.Events;
    entity Comments          as projection on evt.Comments;
    entity Users          as projection on evt.Users;
    // entity EventAttendees as projection on evt.EventAttendees;
};
