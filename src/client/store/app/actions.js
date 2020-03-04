import translate from '~/common/services/i18n';

import ActionTypes from '~/client/store/app/types';
import { NOTIFICATION } from '~/client/middlewares/notifications';
import { NotificationsTypes } from '~/client/store/notifications/actions';
import { generateRequestId } from '~/client/middlewares/api';
import { postRequest } from '~/client/store/api/actions';

export const TOKEN_REQUEST_ID = generateRequestId();

export function initializeApp() {
  return dispatch => {
    dispatch(initializeToken());

    dispatch({
      type: ActionTypes.APP_INITIALIZE,
    });
  };
}

export function initializeToken() {
  return {
    type: ActionTypes.APP_TOKEN_INITIALIZE,
  };
}

export function requestToken(email, password) {
  return postRequest(
    {
      id: TOKEN_REQUEST_ID,
      path: ['auth'],
      body: {
        email,
        password,
      },
    },
    {
      request: {
        type: ActionTypes.APP_TOKEN_REQUEST,
      },
      success: {
        type: ActionTypes.APP_TOKEN_REQUEST_SUCCESS,
        [NOTIFICATION]: {
          text: translate('app.notificationTokenSuccess'),
        },
      },
      failure: {
        type: ActionTypes.APP_TOKEN_REQUEST_FAILURE,
        [NOTIFICATION]: {
          text: translate('app.errorTokenFailure'),
          type: NotificationsTypes.ERROR,
        },
      },
    },
  );
}

export function resetToken() {
  return {
    type: ActionTypes.APP_TOKEN_RESET,
  };
}
