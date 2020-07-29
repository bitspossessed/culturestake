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
  requestId,
}) {
  return getRequest(
    {
      path,
      id: requestId,
      params: {
        limit: pageSize,
        offset: pageIndex * pageSize,
        orderDirection,
        orderKey,
      },
    },
    {
      request: {
        type: ActionTypes.TABLES_REQUEST,
        meta: {
          orderDirection,
          orderKey,
          pageSize,
          pageIndex,
        },
      },
      success: {
        type: ActionTypes.TABLES_REQUEST_SUCCESS,
      },
      failure: {
        type: ActionTypes.TABLES_REQUEST_FAILURE,
      },
    },
  );
}
