import httpStatus from 'http-status';

import ActionTypes from '~/store/api/types';
import { resetToken } from '~/store/app/actions';

const apiErrorMiddleware = store => next => async action => {
  if (action.type !== ActionTypes.API_FAILURE) {
    return next(action);
  }

  if (!action.error || !action.error.response || !action.error.response.code) {
    return next(action);
  }

  const { code } = action.error.response;

  if (code === httpStatus.UNAUTHORIZED) {
    const { app } = store.getState();

    if (app.isAuthenticated) {
      store.dispatch(resetToken());
    }
  }

  return next(action);
};

export default apiErrorMiddleware;
