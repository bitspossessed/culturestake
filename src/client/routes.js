import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Admin from '~/client/views/Admin';
import AdminFestivals from '~/client/views/AdminFestivals';
import AdminFestivalsEdit from '~/client/views/AdminFestivalsEdit';
import AdminFestivalsNew from '~/client/views/AdminFestivalsNew';
import AdminLogin from '~/client/views/AdminLogin';
import AdminUsers from '~/client/views/AdminUsers';
import AdminUsersEdit from '~/client/views/AdminUsersEdit';
import AdminUsersNew from '~/client/views/AdminUsersNew';
import Booth from '~/client/views/Booth';
import Festivals from '~/client/views/Festivals';
import FestivalsProfile from '~/client/views/FestivalsProfile';
import Homepage from '~/client/views/Homepage';
import NotFound from '~/client/views/NotFound';
import Vote from '~/client/views/Vote';

const SessionContainer = ({ component: Component, isTokenRequired = null }) => {
  const app = useSelector((state) => state.app);

  // Do not do anything yet when not ready
  if (!app.isReady) {
    return null;
  }

  // Redirect us when token authentication is required
  if (isTokenRequired !== null && isTokenRequired && !app.isAuthenticated) {
    return <Redirect to="/" />;
  }

  // Redirect us when we are not allowed to be logged in
  if (isTokenRequired !== null && !isTokenRequired && app.isAuthenticated) {
    return <Redirect to="/admin" />;
  }

  return <Component />;
};

const AuthenticatedRoute = ({ component, path }) => {
  return (
    <Route path={path}>
      <SessionContainer component={component} isTokenRequired={true} />
    </Route>
  );
};

const UnauthenticatedRoute = ({ component, path }) => {
  return (
    <Route path={path}>
      <SessionContainer component={component} isTokenRequired={false} />
    </Route>
  );
};

const PublicRoute = ({ component, path }) => {
  return (
    <Route path={path}>
      <SessionContainer component={component} />
    </Route>
  );
};

// prettier-ignore
const Routes = () => (
  <Switch>
    <PublicRoute
      component={Homepage}
      exact
      path="/"
    />
    <PublicRoute
      component={FestivalsProfile}
      exact
      path="/festivals/:slug"
    />
    <PublicRoute
      component={Festivals}
      exact
      path="/festivals"
    />
    <AuthenticatedRoute
      component={Admin}
      exact
      path="/admin"
    />
    <AuthenticatedRoute
      component={AdminUsers}
      exact
      path="/admin/users"
    />
    <AuthenticatedRoute
      component={AdminUsersNew}
      exact
      path="/admin/users/new"
    />
    <AuthenticatedRoute
      component={AdminUsersEdit}
      exact
      path="/admin/users/:slug/edit"
    />
    <AuthenticatedRoute
      component={AdminFestivals}
      exact
      path="/admin/festivals"
    />
    <AuthenticatedRoute
      component={AdminFestivalsNew}
      exact
      path="/admin/festivals/new"
    />
    <AuthenticatedRoute
      component={AdminFestivalsEdit}
      exact
      path="/admin/festivals/:slug/edit"
    />
    <AuthenticatedRoute
      component={Booth}
      path="/booth"
    />
    <UnauthenticatedRoute
      component={AdminLogin}
      path="/login"
    />
    <PublicRoute
      component={Vote}
      path="/vote"
    />
    <Route
      component={NotFound}
    />
  </Switch>
);

SessionContainer.propTypes = {
  component: PropTypes.elementType.isRequired,
  isTokenRequired: PropTypes.bool,
};

AuthenticatedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
};

UnauthenticatedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
};

PublicRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
};

export default Routes;
