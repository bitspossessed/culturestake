import ActionTypes from '~/client/store/api/types';
import apiRequest from '~/client/services/api';
import web3 from '~/common/services/web3';
import { API_REQUEST } from '~/client/store/api/actions';
import { setCached } from '~/client/services/cache';

export function generateRequestId() {
  return web3.utils.randomHex(16).slice(2);
}

export function generateResourceId(pathStr) {
  return web3.utils.sha3(pathStr).slice(2, 34);
}

const apiMiddleware = (store) => (next) => async (action) => {
  if (!(API_REQUEST in action)) {
    return next(action);
  }

  // Assign a random hash to this request or take a custom one.
  // Request ids are helpful to identify responses from certain requests
  // to render the according error messages into the view.
  const id = action[API_REQUEST].id || generateRequestId();

  const { app } = store.getState();
  const { path, method, body, types } = action[API_REQUEST];

  if (types.request && types.request.type) {
    store.dispatch({ ...types.request });
  }

  store.dispatch({
    type: ActionTypes.API_REQUEST,
    id,
  });

  try {
    // Do the actual request
    const response = await apiRequest({
      path,
      body,
      method,
      token: app.token,
    });

    // Store data in cache, not in redux store
    setCached(id, response);

    if (types.success && types.success.type) {
      store.dispatch({ ...types.success, response });
    }

    store.dispatch({
      type: ActionTypes.API_SUCCESS,
      id,
    });
  } catch (error) {
    if (types.failure && types.failure.type) {
      store.dispatch({ ...types.failure, error });
    }

    store.dispatch({
      type: ActionTypes.API_FAILURE,
      id,
      error,
    });
  }
};

export default apiMiddleware;
