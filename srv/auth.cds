using EventsService from './EventsService';

annotate EventsService.Events with @(requires: 'authenticated-user');
