import { useSelector } from 'react-redux';

import { getQueueId } from '~/client/store/ethereum/actions';

export const useQueue = ({ txMethod, params = {} }) => {
  const {
    isError = false,
    isPending = false,
    isSuccess = false,
    txHash = null,
  } = useSelector((state) => {
    const id = getQueueId(txMethod, params);
    return state.ethereum.transactionsQueue[id] || {};
  });

  return {
    isError,
    isPending,
    isSuccess,
    txHash,
  };
};

export const useOwnerAddress = () => {
  const { address } = useSelector((state) => {
    return state.ethereum;
  });

  return address;
};
