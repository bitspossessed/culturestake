import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useCallback, useState, useMemo } from 'react';

import apiRequest from '~/client/services/api';
import {
  generateRequestId,
  generateResourceId,
} from '~/client/middlewares/api';
import { getCached } from '~/client/services/cache';
import { getRequest } from '~/client/store/api/actions';

// Create a random, unique request id
export const useRequestId = () => {
  return useMemo(() => {
    return generateRequestId();
  }, []);
};

// Create a deterministic request id based on a resource path
export const useResourceId = (path) => {
  const pathStr = path.join('');

  return useMemo(() => {
    if (pathStr.length === 0) {
      return null;
    }

    return generateResourceId(pathStr);
  }, [pathStr]);
};

// Returns the current state of an request via its id
export const useRequest = (requestId, { onError, onSuccess } = {}) => {
  const {
    isError = false,
    isPending = false,
    isSuccess = false,
    error = null,
  } = useSelector((state) => {
    return state.api.requests[requestId] || {};
  });

  const response = useMemo(() => {
    if (isSuccess) {
      return getCached(requestId);
    }

    return {};
  }, [isSuccess, requestId]);

  useEffect(() => {
    if (isError && onError) {
      onError(error);
    } else if (isSuccess && onSuccess) {
      onSuccess(response);
    }
  }, [isError, isSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    response,
    isError,
    isPending,
    isSuccess,
  };
};

// Returns the current state of an request via its id and dispatches it
// automatically
export const useResource = (path, { onError, onSuccess } = {}) => {
  const requestId = useResourceId(path);
  const dispatch = useDispatch();

  const { response, isSuccess, isError } = useRequest(requestId, {
    onError,
    onSuccess,
  });

  // A resource is always pending until its there ..
  const isPending = !isSuccess && !isError;

  const pathStr = path.join('/');

  useEffect(() => {
    if (!pathStr) {
      return;
    }

    dispatch(
      getRequest({
        path: pathStr.split('/'),
        id: requestId,
      }),
    );
  }, [requestId, dispatch, pathStr]);

  return [response, isPending];
};

// Returns data, loading state and functions to easily paginate through
// API resources
export const usePaginatedResource = (path, body = { orderKey: 'title' }) => {
  const [resources, setResources] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const loadMoreResources = useCallback(async () => {
    const { results, pagination } = await apiRequest({
      path,
      body: {
        offset,
        ...body,
      },
    });

    setResources((resources) => resources.concat(results));
    setHasMore(pagination.offset + pagination.limit < pagination.total);
    setOffset((offset) => offset + pagination.limit);
  }, [offset, body, path]);

  useEffect(() => {
    loadMoreResources();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return [resources, loadMoreResources, hasMore];
};
