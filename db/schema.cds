namespace events;

using {
    cuid,
    managed,
    Country
} from '@sap/cds/common';

entity Events : cuid, managed {
    name        : String;
    description : String;
    start_date  : DateTime;
    end_date    : DateTime;
    image_url   : String;
    type        : String;
    address     : Address; // todo change
    hosts       : Composition of many Comments
                      on hosts.event = $self;
    comments    : Composition of many Comments
                      on comments.event = $self;
    attendees   : Composition of many EventAttendees
                      on attendees.event = $self;
    likes       : Composition of many EventLikes
                      on likes.event = $self;
    labels      : Composition of many EventLabels
                      on labels.event = $self;
};

entity Comments : cuid, managed {
    title     : String;
    image_url : String;
    content   : String;
    event     : Association to one Events;
    author    : Association to one Users;
};

entity Users : cuid, managed {
    name       : String;
    email      : String;
    avatar_url : String;
};

entity Labels : cuid {
    name : String(15);
    icon : String(40);
};

entity EventAttendees {
    key user  : Association to one Users;
    key event : Association to one Events;
};

entity EventLikes {
    key user  : Association to one Users;
    key event : Association to one Events;
};

entity EventHosts {
    key user  : Association to one Users;
    key event : Association to one Events;
};

entity EventLabels {
    key event : Association to one Events;
    key label : Association to one Labels;
};

type Address { //todo fix
    city    : String;
    country : Country;
    address : String;
};
