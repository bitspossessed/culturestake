import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { generateRequestId } from '~/client/middlewares/api';

export const useRequestId = () => {
  return useMemo(() => {
    return generateRequestId();
  }, []);
};

export const useRequest = (requestId, { onError, onSuccess }) => {
  const {
    isError = false,
    isPending = false,
    isSuccess = false,
    error,
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
  }, [isError, isSuccess]);

  return {
    isError,
    isPending,
    isSuccess,
  };
};
