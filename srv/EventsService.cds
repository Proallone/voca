using {events as evt} from '../db/schema';

service EventsService {
    entity Events     as projection on evt.Events;
    entity Posts      as projection on evt.Posts;
    entity EventPosts as projection on evt.EventPosts;
    entity Users      as projection on evt.Users;
};
