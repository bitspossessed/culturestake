import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Admin from '~/client/views/Admin';
import AdminAnswersEdit from '~/client/views/AdminAnswersEdit';
import AdminAnswersNew from '~/client/views/AdminAnswersNew';
import AdminArtists from '~/client/views/AdminArtists';
import AdminArtistsEdit from '~/client/views/AdminArtistsEdit';
import AdminArtistsNew from '~/client/views/AdminArtistsNew';
import AdminArtworks from '~/client/views/AdminArtworks';
import AdminArtworksEdit from '~/client/views/AdminArtworksEdit';
import AdminArtworksNew from '~/client/views/AdminArtworksNew';
import AdminBooths from '~/client/views/AdminBooths';
import AdminEmails from '~/client/views/AdminEmails';
import AdminFestivals from '~/client/views/AdminFestivals';
import AdminFestivalsEdit from '~/client/views/AdminFestivalsEdit';
import AdminFestivalsNew from '~/client/views/AdminFestivalsNew';
import AdminFestivalAnswersNew from '~/client/views/AdminFestivalAnswersNew';
import AdminFestivalAnswersEdit from '~/client/views/AdminFestivalAnswersEdit';
import AdminFestivalQuestionsNew from '~/client/views/AdminFestivalQuestionsNew';
import AdminFestivalQuestionsEdit from '~/client/views/AdminFestivalQuestionsEdit';
import AdminLogin from '~/client/views/AdminLogin';
import AdminOrganisations from '~/client/views/AdminOrganisations';
import AdminOrganisationsEdit from '~/client/views/AdminOrganisationsEdit';
import AdminOrganisationsNew from '~/client/views/AdminOrganisationsNew';
import AdminProperties from '~/client/views/AdminProperties';
import AdminPropertiesEdit from '~/client/views/AdminPropertiesEdit';
import AdminPropertiesNew from '~/client/views/AdminPropertiesNew';
import AdminQuestions from '~/client/views/AdminQuestions';
import AdminQuestionsEdit from '~/client/views/AdminQuestionsEdit';
import AdminQuestionsNew from '~/client/views/AdminQuestionsNew';
import AdminUsers from '~/client/views/AdminUsers';
import AdminUsersEdit from '~/client/views/AdminUsersEdit';
import AdminUsersNew from '~/client/views/AdminUsersNew';
import AdminVoteweightsNew from '~/client/views/AdminVoteweightsNew';
import AdminVoteweightsView from '~/client/views/AdminVoteweightsView';
import Artworks from '~/client/views/Artworks';
import ArtworksProfile from '~/client/views/ArtworksProfile';
import Booth from '~/client/views/Booth';
import Festivals from '~/client/views/Festivals';
import FestivalsProfile from '~/client/views/FestivalsProfile';
import Invitations from '~/client/views/Invitations';
import RemoteVote from '~/client/views/RemoteVote';
import Homepage from '~/client/views/Homepage';
import HotspotVote from '~/client/views/HotspotVote';
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
      component={Festivals}
      exact
      path="/events"
    />
    <PublicRoute
      component={FestivalsProfile}
      exact
      path="/events/:slug"
    />
    <PublicRoute
      component={Artworks}
      exact
      path="/events/:festivalSlug/artworks"
    />
    <PublicRoute
      component={Invitations}
      exact
      path="/events/:festivalSlug/invitations"
    />
    <PublicRoute
      component={RemoteVote}
      exact
      path="/events/:festivalSlug/invitations/:token"
    />
    <PublicRoute
      component={ArtworksProfile}
      exact
      path="/events/:festivalSlug/artworks/:artworkSlug"
    />
    <PublicRoute
      component={Vote}
      exact
      path="/vote"
    />
    <PublicRoute
      component={HotspotVote}
      exact
      path="/hotspot"
    />
    <PublicRoute
      component={Booth}
      exact
      path="/booth"
    />
    <UnauthenticatedRoute
      component={AdminLogin}
      exact
      path="/login"
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
      component={AdminBooths}
      exact
      path="/admin/booths"
    />
    <AuthenticatedRoute
      component={AdminFestivals}
      exact
      path="/admin/events"
    />
    <AuthenticatedRoute
      component={AdminFestivalsNew}
      exact
      path="/admin/events/new"
    />
    <AuthenticatedRoute
      component={AdminFestivalsEdit}
      exact
      path="/admin/events/:slug/edit"
    />
    <AuthenticatedRoute
      component={AdminVoteweightsNew}
      exact
      path="/admin/events/:slug/voteweights/new"
    />
    <AuthenticatedRoute
      component={AdminVoteweightsView}
      exact
      path="/admin/events/:slug/voteweights/:voteweightId"
    />
    <AuthenticatedRoute
      component={AdminFestivalQuestionsNew}
      exact
      path="/admin/events/:slug/questions/new"
    />
    <AuthenticatedRoute
      component={AdminFestivalQuestionsEdit}
      exact
      path="/admin/events/:slug/questions/:questionId/edit"
    />
    <AuthenticatedRoute
      component={AdminQuestions}
      exact
      path="/admin/questions"
    />
    <AuthenticatedRoute
      component={AdminQuestionsNew}
      exact
      path="/admin/questions/new"
    />
    <AuthenticatedRoute
      component={AdminQuestionsEdit}
      exact
      path="/admin/questions/:questionId/edit"
    />
    <AuthenticatedRoute
      component={AdminFestivalAnswersNew}
      exact
      path="/admin/events/:slug/questions/:questionId/answers/new"
    />
    <AuthenticatedRoute
      component={AdminFestivalAnswersEdit}
      exact
      path="/admin/events/:slug/questions/:questionId/answers/:answerId/edit"
    />
    <AuthenticatedRoute
      component={AdminAnswersNew}
      exact
      path="/admin/questions/:questionId/answers/new"
    />
    <AuthenticatedRoute
      component={AdminAnswersEdit}
      exact
      path="/admin/questions/:questionId/answers/:answerId/edit"
    />
    <AuthenticatedRoute
      component={AdminEmails}
      exact
      path="/admin/emails"
    />
    <AuthenticatedRoute
      component={AdminProperties}
      exact
      path="/admin/properties"
    />
    <AuthenticatedRoute
      component={AdminPropertiesNew}
      exact
      path="/admin/properties/new"
    />
    <AuthenticatedRoute
      component={AdminPropertiesEdit}
      exact
      path="/admin/properties/:slug/edit"
    />
    <AuthenticatedRoute
      component={AdminArtworks}
      exact
      path="/admin/artworks"
    />
    <AuthenticatedRoute
      component={AdminArtworksNew}
      exact
      path="/admin/artworks/new"
    />
    <AuthenticatedRoute
      component={AdminArtworksEdit}
      exact
      path="/admin/artworks/:slug/edit"
    />
    <AuthenticatedRoute
      component={AdminArtists}
      exact
      path="/admin/artists"
    />
    <AuthenticatedRoute
      component={AdminArtistsNew}
      exact
      path="/admin/artists/new"
    />
    <AuthenticatedRoute
      component={AdminArtistsEdit}
      exact
      path="/admin/artists/:slug/edit"
    />
    <AuthenticatedRoute
      component={AdminOrganisations}
      exact
      path="/admin/organisations"
    />
    <AuthenticatedRoute
      component={AdminOrganisationsNew}
      exact
      path="/admin/organisations/new"
    />
    <AuthenticatedRoute
      component={AdminOrganisationsEdit}
      exact
      path="/admin/organisations/:slug/edit"
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
