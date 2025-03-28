using {events as evt} from '../db/schema';

service EventsService {
    entity Events         as
        projection on evt.Events {
            *,
            count(
                attendees.event.ID
            ) as attendeesCount : Integer,
        }
        group by
            ID;

    entity Posts          as projection on evt.Posts;
    entity Users          as projection on evt.Users;
    entity EventAttendees as projection on evt.EventAttendees;
};
