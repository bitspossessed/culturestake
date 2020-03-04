import update from 'immutability-helper';
import { DateTime } from 'luxon';

import ActionTypes from '~/client/store/resources/types';

const initialState = {
  createdAt: undefined,
  updatedAt: undefined,
  data: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  path: [],
};

const resourcesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RESOURCES_REQUEST:
      return update(state, {
        createdAt: { $set: DateTime.local().toISO() },
        updatedAt: { $set: DateTime.local().toISO() },
        data: { $set: null },
        isError: { $set: false },
        isLoading: { $set: true },
        isSuccess: { $set: false },
        path: { $set: action.meta.path },
      });
    case ActionTypes.RESOURCES_REQUEST_SUCCESS:
      return update(state, {
        updatedAt: { $set: DateTime.local().toISO() },
        data: { $set: action.response },
        isLoading: { $set: false },
        isSuccess: { $set: true },
      });
    case ActionTypes.RESOURCES_REQUEST_FAILURE:
      return update(state, {
        updatedAt: { $set: DateTime.local().toISO() },
        isLoading: { $set: false },
        isError: { $set: true },
      });
    default:
      return state;
  }
};

export default resourcesReducer;
