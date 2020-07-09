import { useSelector } from 'react-redux';

import { getTransactionId } from '~/client/store/ethereum/actions';

export const usePendingTransaction = ({ txMethod, params = {} }) => {
  const {
    isError = false,
    isPending = false,
    isSuccess = false,
    txHash = null,
  } = useSelector((state) => {
    const id = getTransactionId(txMethod, params);
    return state.ethereum.transactions[id] || {};
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
