namespace events;

using { cuid, managed } from '@sap/cds/common';

entity  Events : cuid , managed {
    name: String;
    description: String;
    startDate: DateTime;
    endDate : DateTime;
    image_url: String;
    host: Association to many Users;
    posts: Association to many BlogPosts;
};

entity BlogPosts : cuid, managed {
    title: String;
    image_url: String;
    content: String;
    event: Association to one Events;
    authors: Association to many Users;
};

entity Users : cuid, managed {
    name: String;
    email: String;
    avatar_url: String;
};

