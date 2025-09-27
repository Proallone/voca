using EventsService from './EventsService';

annotate EventsService.Events with @(restrict: [
    {grant: ['READ']},
    {
        grant: [
            'UPDATE',
            'CREATE'
        ],
        to   : 'host'
    },
    {
        grant: [
            'like',
            'attend'
        ],
        to   : 'user'
    }
]);


// annotate EventsService.Events with @(require: ['authenticated-user']);
