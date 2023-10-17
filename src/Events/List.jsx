import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../_services';
import { mailServiceClient } from './mailServiceClient';
import { mailServiceServer } from './mailServiceServer';


function List({ match }) {
    const { path } = match;
    const [events, setEvents] = useState(null);

    useEffect(() => {
        // Fetch events when the component mounts
        eventService.getAll()
            .then(x => setEvents(x))
            .catch(error => console.error('Error fetching events:', error));
    }, []);

    function deleteEvent(id) {
        setEvents(events.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        eventService.delete(id)
            .then(() => {
                setEvents(events => events.filter(x => x.id !== id));
            })
            .catch(error => console.error('Error deleting event:', error));
    }

    function sendReport(id) {
        // Simulate sending an email with mock data on the client side
        mailServiceClient.sendMail({
            from: 'bojance666@gmail.com',
            to: 'h.bojana@live.com',
            subject: 'Activity report',
            html: `<h1>Activity report for ${id}</h1>`,
        })
            .then(() => {
                setEvents(events => events.filter(x => x.id !== id));
            })
            .catch(error => console.error('Error sending report:', error));
    }

    return (
        <div>
            <h1>Activity reports</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add User Activities</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Name</th>
                        <th style={{ width: '20%' }}>Description</th>
                        <th style={{ width: '15%' }}>Date from</th>
                        <th style={{ width: '15%' }}>Date to</th>
                        <th style={{ width: '10%' }}>Time spent</th>
                    </tr>
                </thead>
                <tbody>
                    {events && events.map(event =>
                        <tr key={event.id}>
                            <td>{event.name}</td>
                            <td>{event.description}</td>
                            <td>{event.dateOfEvent}</td>
                            <td>{event.dateToEvent}</td>
                            <td>{event.timeSpent}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${event.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button onClick={() => sendReport(event.id)} className="btn btn-sm btn-danger btn-delete-event" disabled={event.sendMail}>
                                    {event.sendMail
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Report</span>
                                    }
                                </button>
                                <button onClick={() => deleteEvent(event.id)} className="btn btn-sm btn-danger btn-delete-event" disabled={event.isDeleting}>
                                    {event.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!events &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
                            </td>
                        </tr>
                    }
                    {events && !events.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No Events To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { List };
