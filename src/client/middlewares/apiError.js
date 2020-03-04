import httpStatus from 'http-status';

import translate from '~/common/services/i18n';

import ActionTypes from '~/client/store/api/types';
import { resetToken } from '~/client/store/app/actions';

import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

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
      // Reset session as it might have been expired and is invalid
      store.dispatch(resetToken());

      store.dispatch(
        notify({
          text: translate('apiError.errorExpiredSession'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  }

  return next(action);
};

export default apiErrorMiddleware;
