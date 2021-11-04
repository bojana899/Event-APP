import { Role } from './'

export function configureFakeBackendEvents() {
    // array in local storage for event records
    let events = JSON.parse(localStorage.getItem('events')) || [{
        id: 1,
        name: 'Event',
        description: 'Joe',
        dateOfEvent: '1989-12-12',

    }];


    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {

            setTimeout(handleRoute, 500);

            function handleRoute() {
                const { method } = opts;
                switch (true) {
                    case url.endsWith('/events') && method === 'GET':
                        return getEvents();
                    case url.match(/\/events\/\d+$/) && method === 'GET':
                        return getEventById();
                    case url.endsWith('/events') && method === 'POST':
                        return createEvent();
                    case url.match(/\/events\/\d+$/) && method === 'PUT':
                        return updateEvent();
                    case url.match(/\/events\/\d+$/) && method === 'DELETE':
                        return deleteEvent();
                    default:

                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // route functions

            function getEvents() {
                return ok(events);
            }

            function getEventById() {
                let event = events.find(x => x.id === idFromUrl());
                return ok(event);
            }

            function createEvent() {
                debugger;
                const event = body();




                event.id = newEventId();
                // event.dateCreated = new Date();
                //event.date = new Date();

                events.push(event);
                localStorage.setItem('events', JSON.stringify(events));

                return ok();
            }

            function updateEvent() {
                let params = body();
                let event = events.find(x => x.id === idFromUrl());



                // update and save event
                Object.assign(event, params);
                localStorage.setItem('events', JSON.stringify(events));

                return ok();
            }

            function deleteEvent() {
                events = events.filter(x => x.id !== idFromUrl());
                localStorage.setItem('events', JSON.stringify(events));

                return ok();
            }

            // helper functions

            function ok(body) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) });
            }

            function error(message) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) });
            }

            function idFromUrl() {
                const urlParts = url.split('/');
                return parseInt(urlParts[urlParts.length - 1]);
            }

            function body() {
                return opts.body && JSON.parse(opts.body);
            }

            function newEventId() {
                return events.length ? Math.max(...events.map(x => x.id)) + 1 : 1;
            }
        });
    }
};