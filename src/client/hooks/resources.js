import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { requestResource } from '~/client/store/resources/actions';

export const useResource = (path, { onError, onSuccess }) => {
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
  const pathStr = path.join('');
  const currentPathStr = currentPath.join('');

  // Request the resource from the API when we don't have it yet or
  // another resource is still in the cache
  const isRequestedPath = () => currentPathStr === pathStr;

  // Request the resource on every component mount
  useEffect(() => {
    dispatch(requestResource(path));
  }, []);

  useEffect(() => {
    if (isError && onError) {
      onError();
    } else if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [currentPathStr, isError, isSuccess]);

  // Return the resource (when given) and the loading state
  const data = useMemo(() => {
    if (isRequestedPath() && isSuccess) {
      return currentData;
    }

    return {};
  }, [isLoading]);

  return [data, isLoading];
};
