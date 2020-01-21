import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Dashboard from '~/views/Dashboard';
import NotFound from '~/views/NotFound';

const SessionContainer = ({ component: Component }) => {
  const { app } = useSelector(state => {
    return {
      app: state.app,
    };
  });

  // Do not do anything yet when we are not ready
  if (!app.isReady) {
    return null;
  }

  return <Component />;
};

const SessionRoute = ({ component, path }) => {
  return (
    <Route path={path}>
      <SessionContainer component={component} />
    </Route>
  );
};

const Routes = () => (
  <Switch>
    <SessionRoute component={Dashboard} exact path="/" />
    <Route component={NotFound} />
  </Switch>
);

SessionContainer.propTypes = {
  component: PropTypes.elementType.isRequired,
};

SessionRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
};

export default Routes;
