import update from 'immutability-helper';

import ActionTypes from '~/client/store/tables/types';

import {
  DEFAULT_LIMIT,
  DEFAULT_ORDER_DIRECTION,
  DEFAULT_ORDER_KEY,
} from '~/client/store/tables/actions';

const initialState = {
  isError: false,
  isLoading: false,
  isSuccess: false,
  orderDirection: DEFAULT_ORDER_DIRECTION,
  orderKey: DEFAULT_ORDER_KEY,
  pageSize: DEFAULT_LIMIT,
  pageIndex: 0,
  pagesTotal: 0,
  results: [],
};

const tablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.TABLES_REQUEST:
      return update(state, {
        isError: { $set: false },
        isLoading: { $set: true },
        isSuccess: { $set: false },
        orderDirection: { $set: action.meta.orderDirection },
        orderKey: { $set: action.meta.orderKey },
        pageSize: { $set: action.meta.pageSize },
        pageIndex: { $set: action.meta.pageIndex },
        pagesTotal: { $set: 0 },
        results: { $set: [] },
      });
    case ActionTypes.TABLES_REQUEST_SUCCESS: {
      const pagesTotal = Math.ceil(
        action.response.pagination.total / state.pageSize,
      );

      return update(state, {
        isLoading: { $set: false },
        isSuccess: { $set: true },
        results: { $set: action.response.results },
        pagesTotal: { $set: pagesTotal },
      });
    }
    case ActionTypes.TABLES_REQUEST_FAILURE:
      return update(state, {
        isLoading: { $set: false },
        isError: { $set: true },
      });
    default:
      return state;
  }
};

export default tablesReducer;
