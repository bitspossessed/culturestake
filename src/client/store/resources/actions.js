import ActionTypes from '~/client/store/resources/types';
import { getRequest } from '~/client/store/api/actions';

export function requestResource(path) {
  return getRequest(
    {
      path,
    },
    {
      request: {
        type: ActionTypes.RESOURCES_REQUEST,
        meta: {
          path,
        },
      },
      success: {
        type: ActionTypes.RESOURCES_REQUEST_SUCCESS,
      },
      failure: {
        type: ActionTypes.RESOURCES_REQUEST_FAILURE,
      },
    },
  );
}
