import ActionTypes from '~/store/app/types';
import { postRequest } from '~/store/api/actions';

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
      },
      failure: {
        type: ActionTypes.APP_TOKEN_REQUEST_FAILURE,
      },
    },
  );
}

export function resetToken() {
  return {
    type: ActionTypes.APP_TOKEN_RESET,
  };
}
