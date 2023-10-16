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
        dateToEvent: '',
        timeSpent: '',


    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required'),
        description: Yup.string()
            .required('Description Name is required'),
        dateOfEvent: Yup.string()
            .required('Date is required'),
        timeSpent: Yup.string()
            .required('Time is required')
            .min(0, "Time spent must be greater than or equal to 0")

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
                alertService.success('User Activities added', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(() => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    function updateEvent(id, fields, setSubmitting) {

        eventService.update(id, fields)
            .then(() => {
                alertService.success('User Activities updated', { keepAfterRouteChange: true });
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
                            const fields = ['name', 'description', 'dateOfEvent', 'dateToEvent', 'timeSpent'];
                            fields.forEach(field => setFieldValue(field, event[field], false));
                            setEvent(event);
                        });
                    }
                }, []);

                return (
                    <Form>
                        <h1>{isAddMode ? 'Add User Activities' : 'Edit User Activities'}</h1>
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
                                <label>Date from</label>
                                <Field value={values.dateOfEvent}
                                    onChange={e => {
                                        setFieldValue("dateOfEvent", e.target.value);
                                    }} name="dateOfEvent" type="date" className={'form-control' + (errors.dateOfEvent && touched.dateOfEvent ? ' is-invalid' : '')}
                                />
                            </div>

                            <div className="form-group col-4">
                                <label>Date to</label>
                                <Field value={values.dateToEvent}
                                    onChange={e => {
                                        setFieldValue("dateToEvent", e.target.value);
                                    }} name="dateToEvent" type="date" className={'form-control' + (errors.dateToEvent && touched.dateOfEvent ? ' is-invalid' : '')}
                                />
                            </div>

                            <div className="form-group col-4">
                                <label>Time Spent (in hours):</label>
                                <Field value={values.timeSpent}
                                    onChange={e => {
                                        setFieldValue("timeSpent", e.target.value);
                                    }}
                                    name="timeSpent"
                                    type="number"
                                    id="timeSpent"
                                    min="0"
                                    step="0.5" className={'form-control' + (errors.timeSpent && touched.timeSpent ? ' is-invalid' : '')}
                                />
                                <ErrorMessage name="timeSpent" component="div" className="invalid-feedback" />
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