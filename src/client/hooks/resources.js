import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import apiRequest from '~/client/services/api';
import { requestResource } from '~/client/store/resources/actions';

export const useResource = (
  path,
  { onError, onSuccess, isCollection = false },
) => {
  const dispatch = useDispatch();

  // Check the redux store for the current caching state
  const {
    data: currentData,
    path: currentPath,
    isError,
    isLoading,
    isSuccess,
  } = useSelector((state) => state.resources);

  // Convert arrays to strings for easier comparison
  const pathStr = path.join('/');
  const currentPathStr = currentPath.join('/');

  // Request the resource on every component mount
  useEffect(() => {
    dispatch(requestResource(pathStr.split('/')));
  }, [pathStr, dispatch]);

  useEffect(() => {
    if (isError && onError) {
      onError();
    } else if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [isError, isSuccess, onError, onSuccess]);

  // Return the resource (when given) and the loading state
  const data = useMemo(() => {
    // Request the resource from the API when we don't have it yet or
    // another resource is still in the cache
    const isRequestedPath = () => currentPathStr === pathStr;

    if (isRequestedPath() && isSuccess) {
      return currentData;
    }

    return isCollection ? [] : {};
  }, [currentPathStr, pathStr, currentData, isSuccess, isCollection]);

  return [data, isLoading];
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
