import update from 'immutability-helper';

import ActionTypes from '~/client/store/app/types';
import decodeToken from '~/client/utils/jwt';
import { hasItem, getItem, setItem, removeItem } from '~/client/utils/storage';

const TOKEN_STORAGE = 'token';

function initializeToken() {
  let token = null;

  // Check if a valid JWT token exists, which means ..
  //
  // 1. It exists in our localStorage
  if (hasItem(TOKEN_STORAGE)) {
    const payload = decodeToken(getItem(TOKEN_STORAGE));

    // 2. Payload can be decoded
    if (!payload) {
      return;
    }

    // 3. Has not expired yet
    // 4. Refers to correct issuer
    // 5. Payload contains a valid user id
    const isNotExpired = payload.exp > Date.now() / 1000;
    const isCorrectIssuer = payload.iss === process.env.BASE_PATH;
    const isValidUser = typeof payload.userId === 'number';

    if (isNotExpired && isValidUser && isCorrectIssuer) {
      token = getItem(TOKEN_STORAGE);
    } else {
      removeItem(TOKEN_STORAGE);
    }
  }

  return token;
}

const initialState = {
  isAlternateColor: false,
  isAlternateFontFace: false,
  isAuthenticated: false,
  isLargerFont: false,
  isReady: false,
  token: null,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.APP_INITIALIZE:
      return update(state, {
        isReady: { $set: true },
      });
    case ActionTypes.APP_TOKEN_INITIALIZE: {
      const token = initializeToken();

      return update(state, {
        isAuthenticated: { $set: !!token },
        token: { $set: token },
      });
    }
    case ActionTypes.APP_TOKEN_REQUEST_SUCCESS: {
      const { token } = action.response;

      setItem(TOKEN_STORAGE, token);

      return update(state, {
        isAuthenticated: { $set: true },
        token: { $set: token },
      });
    }
    case ActionTypes.APP_TOKEN_RESET: {
      removeItem(TOKEN_STORAGE);

      return update(state, {
        isAuthenticated: { $set: false },
        token: { $set: null },
      });
    }
    case ActionTypes.APP_ACCESSIBILITY_UPDATE:
      return update(state, {
        isAlternateColor: { $set: !!action.meta.isAlternateColor },
        isAlternateFontFace: { $set: !!action.meta.isAlternateFontFace },
        isLargerFont: { $set: !!action.meta.isLargerFont },
      });
    default:
      return state;
  }
};

export default appReducer;
