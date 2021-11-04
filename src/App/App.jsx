import React, { useEffect } from 'react';
import { Router, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { Nav, Alert } from '../_components';
import { Events } from '../Events';

function App() {
    const alert = useSelector(state => state.alert);
    const dispatch = useDispatch();
    // const { pathname } = useLocation();

    useEffect(() => {
        history.listen((location, action) => {

            dispatch(alertActions.clear());
        });
    }, []);

    return (
        <div className='container'>
            {alert.message &&
                <div className={`alert ${alert.type}`}>{alert.message}</div>
            }

            <Router history={history}>
                <Nav /><Alert />
                <Switch>
                    <PrivateRoute exact path="/" component={HomePage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <Route path="/events" component={Events} />
                    <Redirect from="*" to="/" />
                </Switch>
            </Router>
        </div>

    );
}

export { App };