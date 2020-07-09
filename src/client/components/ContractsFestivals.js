import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import ButtonIcon from '~/client/components/ButtonIcon';
import EthereumContainer from '~/client/components/EthereumContainer';
import { addPendingTransaction } from '~/client/store/ethereum/actions';
import {
  isFestivalInitialized,
  initializeFestival,
  INITIALIZE_FESTIVAL,
} from '~/common/services/contracts/festivals';
import {
  usePendingTransaction,
  useOwnerAddress,
} from '~/client/hooks/ethereum';
import { useResource } from '~/client/hooks/resources';

const ContractsFestivals = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const [resource, isLoadingResource] = useResource(['festivals', slug], {});

  const { isPending } = usePendingTransaction({
    txMethod: INITIALIZE_FESTIVAL,
    params: { chainId: resource.chainId },
  });
  const owner = useOwnerAddress();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const getInitializedStatus = async () => {
      const state = await isFestivalInitialized(resource.chainId);
      setIsInitialized(state);
    };
    getInitializedStatus();
  }, [resource, isPending]);

  const onClick = async () => {
    const { txHash, txMethod } = await initializeFestival(
      owner,
      resource.chainId,
    );
    dispatch(
      addPendingTransaction({
        txHash,
        txMethod,
        params: { chainId: resource.chainId },
      }),
    );
  };

  return (
    <EthereumContainer>
      {!isLoadingResource ? (
        <ButtonIcon disabled={isInitialized} onClick={onClick}>
          Initialize Festival
        </ButtonIcon>
      ) : null}
    </EthereumContainer>
  );
};

export default ContractsFestivals;
