using { events as evt } from '../db/schema';

service EventsService {
    entity Events as projection on evt.Events;
    entity BlogPosts as projection on evt.BlogPosts;
    entity Users as projection on evt.Users;
};
