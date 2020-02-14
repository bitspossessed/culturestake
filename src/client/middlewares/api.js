import ActionTypes from '~/store/api/types';
import apiRequest from '~/services/api';
import { API_REQUEST } from '~/store/api/actions';

const apiMiddleware = store => next => async action => {
  if (!(API_REQUEST in action)) {
    return next(action);
  }

  const { app } = store.getState();
  const { path, method, body, types } = action[API_REQUEST];

  store.dispatch({
    type: ActionTypes.API_REQUEST,
  });

  if (types.request && types.request.type) {
    store.dispatch({ ...types.request });
  }

  try {
    const response = await apiRequest({
      path,
      body,
      method,
      token: app.token,
    });

    store.dispatch({
      type: ActionTypes.API_SUCCESS,
      response,
    });

    if (types.success && types.success.type) {
      store.dispatch({ ...types.success, response });
    }
  } catch (error) {
    store.dispatch({
      type: ActionTypes.API_FAILURE,
      error,
    });

    if (types.failure && types.failure.type) {
      store.dispatch({ ...types.failure, error });
    }
  }
};

export default apiMiddleware;
