namespace events;

using { cuid, managed } from '@sap/cds/common';

entity  Events : cuid , managed {
    name: String;
    description: String;
    start_date: DateTime;
    end_date : DateTime;
    image_url: String;
    place: String; // todo change
    host: Association to many Users;
    posts: Composition of many Posts on posts.event = $self;
};
entity Posts : cuid, managed {
    title: String;
    image_url: String;
    content: String;
    event: Association to one Events;
    author: Association to one Users;
};

entity Users : cuid, managed {
    name: String;
    email: String;
    avatar_url: String;
};

