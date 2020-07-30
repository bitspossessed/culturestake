import update from 'immutability-helper';

import ActionTypes from '~/client/store/tables/types';

import {
  DEFAULT_LIMIT,
  DEFAULT_ORDER_DIRECTION,
  DEFAULT_ORDER_KEY,
} from '~/client/store/tables/actions';

const initialTableState = {
  isError: false,
  isLoading: true,
  isSuccess: false,
  orderDirection: DEFAULT_ORDER_DIRECTION,
  orderKey: DEFAULT_ORDER_KEY,
  pageSize: DEFAULT_LIMIT,
  pageIndex: 0,
  pagesTotal: 1,
};

const initialState = {
  requests: {},
};

const tablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.TABLES_REQUEST:
      return update(state, {
        requests: {
          $merge: {
            [action.meta.id]: Object.assign({}, initialTableState, {
              orderDirection: action.meta.orderDirection,
              orderKey: action.meta.orderKey,
              pageSize: action.meta.pageSize,
              pageIndex: action.meta.pageIndex,
            }),
          },
        },
      });
    case ActionTypes.TABLES_REQUEST_SUCCESS: {
      const pagesTotal = Math.ceil(
        action.response.pagination.total /
          state.requests[action.meta.id].pageSize,
      );

      return update(state, {
        requests: {
          $merge: {
            [action.meta.id]: Object.assign(
              {},
              state.requests[action.meta.id],
              {
                isLoading: false,
                isSuccess: true,
                pagesTotal,
              },
            ),
          },
        },
      });
    }
    case ActionTypes.TABLES_REQUEST_FAILURE:
      return update(state, {
        requests: {
          $merge: {
            [action.meta.id]: Object.assign(
              {},
              state.requests[action.meta.id],
              {
                isLoading: false,
                isError: true,
              },
            ),
          },
        },
      });
    default:
      return state;
  }
};

export default tablesReducer;
