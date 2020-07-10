import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import ButtonOutline from '~/client/components/ButtonOutline';
import EthereumContainer from '~/client/components/EthereumContainer';
import { addPendingTransaction } from '~/client/store/ethereum/actions';
import {
  isFestivalInitialized,
  initializeFestival,
  TX_INITIALIZE_FESTIVAL,
} from '~/common/services/contracts/festivals';
import {
  usePendingTransaction,
  useOwnerAddress,
} from '~/client/hooks/ethereum';

const ContractsFestivals = ({ chainId }) => {
  const dispatch = useDispatch();

  const { isPending } = usePendingTransaction({
    txMethod: TX_INITIALIZE_FESTIVAL,
    params: { chainId },
  });
  const owner = useOwnerAddress();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const getInitializedStatus = async () => {
      const state = await isFestivalInitialized(chainId);
      setIsInitialized(state);
    };
    getInitializedStatus();
  }, [chainId, isPending]);

  const onClick = async () => {
    const { txHash, txMethod } = await initializeFestival(owner, chainId);

    dispatch(
      addPendingTransaction({
        txHash,
        txMethod,
        params: { chainId },
      }),
    );
  };

  return (
    <EthereumContainer>
      <ButtonOutline disabled={isInitialized} onClick={onClick}>
        Initialize Festival
      </ButtonOutline>
    </EthereumContainer>
  );
};

ContractsFestivals.propTypes = {
  chainId: PropTypes.string.isRequired,
};

export default ContractsFestivals;
