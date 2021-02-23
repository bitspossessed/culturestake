import ActionTypes from '~/client/store/tables/types';
import { getRequest } from '~/client/store/api/actions';

export const ORDER_DIRECTION_ASC = 'asc';
export const ORDER_DIRECTION_DESC = 'desc';

export const DEFAULT_LIMIT = 20;
export const DEFAULT_ORDER_DIRECTION = ORDER_DIRECTION_ASC;
export const DEFAULT_ORDER_KEY = 'id';

export function requestTable({
  path,
  pageSize = DEFAULT_LIMIT,
  pageIndex = 0,
  orderDirection = DEFAULT_ORDER_DIRECTION,
  orderKey = DEFAULT_ORDER_KEY,
  queryParam,
  query,
  requestId,
}) {
  let params = {
    limit: pageSize,
    offset: pageIndex * pageSize,
    orderDirection,
    orderKey,
  };
  if (queryParam && query) {
    params = {
      ...params,
      query,
      queryParam,
    };
  }

  return getRequest(
    {
      id: requestId,
      path,
      params,
    },
    {
      request: {
        type: ActionTypes.TABLES_REQUEST,
        meta: {
          orderDirection,
          orderKey,
          pageSize,
          pageIndex,
          id: requestId,
        },
      },
      success: {
        type: ActionTypes.TABLES_REQUEST_SUCCESS,
        meta: {
          id: requestId,
        },
      },
      failure: {
        type: ActionTypes.TABLES_REQUEST_FAILURE,
        meta: {
          id: requestId,
        },
      },
    },
  );
}
