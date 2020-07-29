import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useCallback, useState, useMemo } from 'react';

import apiRequest from '~/client/services/api';
import {
  generateRequestId,
  generateResourceId,
} from '~/client/middlewares/api';
import { getRequest } from '~/client/store/api/actions';

export const useRequestId = () => {
  return useMemo(() => {
    return generateRequestId();
  }, []);
};

export const useRequest = (requestId, { onError, onSuccess } = {}) => {
  const {
    isError = false,
    isPending = false,
    isSuccess = false,
    error = null,
    response,
  } = useSelector((state) => {
    return state.api.requests[requestId] || {};
  });

  useEffect(() => {
    if (isError && onError) {
      onError(error);
    } else if (isSuccess && onSuccess) {
      onSuccess(response);
    }
  }, [isError, isSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isError,
    isPending,
    isSuccess,
  };
};

export const useResource = (path, { onError, onSuccess } = {}) => {
  const requestId = path.length === 0 ? null : generateResourceId(path);
  const dispatch = useDispatch();

  const {
    isError = false,
    isPending = false,
    isSuccess = false,
    error = null,
    response,
  } = useSelector((state) => {
    return state.api.requests[requestId] || {};
  });

  const pathStr = path.join('/');

  useEffect(() => {
    if (!pathStr) {
      return;
    }

    dispatch(
      getRequest({
        path: pathStr.split('/'),
        id: requestId,
        isResponseKept: true,
      }),
    );
  }, [requestId, dispatch, pathStr]);

  useEffect(() => {
    if (isError && onError) {
      onError(error);
    } else if (isSuccess && onSuccess) {
      onSuccess(response);
    }
  }, [isError, isSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  return [response || {}, isPending];
};

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
