import httpStatus from 'http-status';

import APIError from '~/server/helpers/errors';
import passport from '~/server/services/passport';

function handleAuthentication(error, user, req, next) {
  if (error) {
    return next(error);
  }

  if (!user) {
    return next(new APIError(httpStatus.UNAUTHORIZED));
  }

  req.locals = req.locals || {};
  req.locals.user = user;

  next();
}

export function authLocalMiddleware(req, res, next) {
  passport.authenticate('local', (error, user) => {
    handleAuthentication(error, user, req, next);
  })(req, res, next);
}

export default function authMiddleware(req, res, next) {
  passport.authenticate('jwt', (error, user) => {
    handleAuthentication(error, user, req, next);
  })(req, res, next);
}

export function optionalAuthMiddleware(req, res, next) {
  const auth = req.get('Authorization');

  if (!auth) {
    return next();
  }

  passport.authenticate('jwt', (error, user) => {
    handleAuthentication(error, user, req, next);
  })(req, res, next);
}
