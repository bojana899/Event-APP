import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { eventService, alertService } from '../_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;

    const initialValues = {
        name: '',
        description: '',
        dateOfEvent: '',


    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required'),
        description: Yup.string()
            .required('Description Name is required'),
        dateOfEvent: Yup.string()
            .required('Date is required'),

    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        if (isAddMode) {
            createEvent(fields, setSubmitting);
        } else {
            updateEvent(id, fields, setSubmitting);
        }
    }

    function createEvent(fields, setSubmitting) {
        debugger;
        eventService.create(fields)
            .then(() => {
                alertService.success('Event added', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(() => {
                setSubmitting(false);
                // alertService.error(error);
            });
    }

    function updateEvent(id, fields, setSubmitting) {

        eventService.update(id, fields)
            .then(() => {
                alertService.success('Event updated', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, values, touched, isSubmitting, setFieldValue }) => {
                const [event, setEvent] = useState({});
                const [showPassword, setShowPassword] = useState(false);

                useEffect(() => {
                    if (!isAddMode) {

                        eventService.getById(id).then(event => {
                            const fields = ['name', 'description', 'dateOfEvent'];
                            fields.forEach(field => setFieldValue(field, event[field], false));
                            setEvent(event);
                        });
                    }
                }, []);

                return (
                    <Form>
                        <h1>{isAddMode ? 'Add Event' : 'Edit Event'}</h1>
                        <div className="form-row">

                            <div className="form-group col-4">
                                <label> Name</label>
                                <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-4">
                                <label>Description</label>
                                <Field name="description" type="text" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                                <ErrorMessage name="description" component="div" className="invalid-feedback" />
                            </div>

                            <div className="form-group col-4">
                                <label>Date</label>
                                <Field value={values.dateOfEvent}
                                    onChange={e => {
                                        setFieldValue("dateOfEvent", e.target.value);
                                    }} name="dateOfEvent" type="date" className={'form-control' + (errors.dateOfEvent && touched.dateOfEvent ? ' is-invalid' : '')}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                            <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export { AddEdit };