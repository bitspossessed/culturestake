import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { requestResource } from '~/client/store/resources/actions';

export const useResource = path => {
  const dispatch = useDispatch();

  // Check the redux store for the current caching state
  const {
    data: currentData,
    path: currentPath,
    isLoading,
    isSuccess,
  } = useSelector(state => state.resources);

  // Convert arrays to strings for easier comparison
  const pathStr = path.join('');
  const currentPathStr = currentPath.join('');

  // Request the resource from the API when we don't have it yet or
  // another resource is still in the cache
  const isRequestedPath = () => currentPathStr === pathStr;

  useEffect(() => {
    if (isRequestedPath()) {
      return;
    }

    dispatch(requestResource(path));
  }, [pathStr, currentPathStr]);

  // Return the resource (when given) and the loading state
  const data = useMemo(() => {
    if (isRequestedPath() && isSuccess) {
      return currentData;
    }

    return {};
  }, [isLoading]);

  return [data, isLoading];
};
