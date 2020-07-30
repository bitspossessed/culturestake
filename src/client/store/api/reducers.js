import update from 'immutability-helper';
import { DateTime } from 'luxon';

import ActionTypes from '~/client/store/api/types';

const OUTDATED_REQUESTS_SEC = 30; // in seconds

const initialRequestState = {
  id: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  isError: false,
  isFinished: false,
  isPending: true,
  isSuccess: false,
  error: null,
};

const initialState = {
  requests: {},
  pendingRequests: 0,
};

const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.API_REQUEST: {
      // Add new request to list
      const addedRequestState = update(state, {
        requests: {
          $merge: {
            [action.id]: Object.assign({}, initialRequestState, {
              id: action.id,
              createdAt: DateTime.local().toISO(),
              updatedAt: DateTime.local().toISO(),
              isPending: true,
            }),
          },
        },
        pendingRequests: { $set: state.pendingRequests + 1 },
      });

      // Check for old / outdated requests and remove them from list
      return update(addedRequestState, {
        requests: {
          $set: Object.keys(addedRequestState.requests).reduce((acc, key) => {
            const request = addedRequestState.requests[key];

            if (
              DateTime.fromISO(request.updatedAt).diffNow('seconds') <=
              OUTDATED_REQUESTS_SEC
            ) {
              acc[key] = request;
            }

            return acc;
          }, {}),
        },
      });
    }
    case ActionTypes.API_SUCCESS: {
      return update(state, {
        requests: {
          $merge: {
            [action.id]: Object.assign({}, state.requests[action.id], {
              updatedAt: DateTime.local().toISO(),
              isFinished: true,
              isPending: false,
              isSuccess: true,
            }),
          },
        },
        pendingRequests: { $set: state.pendingRequests - 1 },
      });
    }
    case ActionTypes.API_FAILURE:
      return update(state, {
        requests: {
          $merge: {
            [action.id]: Object.assign({}, state.requests[action.id], {
              updatedAt: DateTime.local().toISO(),
              isError: true,
              isFinished: true,
              isPending: false,
              error: action.error,
            }),
          },
        },
        pendingRequests: { $set: state.pendingRequests - 1 },
      });
    default:
      return state;
  }
};

export default apiReducer;
