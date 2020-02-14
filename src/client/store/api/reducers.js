import update from 'immutability-helper';

import ActionTypes from '~/store/api/types';

const initialState = {
  pendingRequests: 0,
};

const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.API_REQUEST:
      return update(state, {
        pendingRequests: { $set: state.pendingRequests + 1 },
      });
    case ActionTypes.API_SUCCESS:
    case ActionTypes.API_FAILURE:
      return update(state, {
        pendingRequests: { $set: state.pendingRequests - 1 },
      });
    default:
      return state;
  }
};

export default apiReducer;
