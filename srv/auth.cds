using EventsService from './EventsService';

annotate EventsService.Events with @(restrict: [
    { grant: ['READ'] },
    {
        grant: ['UPDATE', 'CREATE'],
        to   : 'host'
    },
    {
        grant: ['like'], to: 'user'
    }
]);
