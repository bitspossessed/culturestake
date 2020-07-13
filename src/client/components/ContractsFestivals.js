import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DateTimePicker from 'react-datetime-picker';

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

const InitializeFestival = ({ chainId, owner }) => {
  const dispatch = useDispatch();

  // const { isPending } = usePendingTransaction({
  //   txMethod: TX_INITIALIZE_FESTIVAL,
  //   params: { chainId },
  // });

  const [festivalStartTime, setFestivalStartTime] = useState(
    new Date(Date.now()),
  );
  const [festivalEndTime, setFestivalEndTime] = useState(new Date(Date.now()));

  const onClick = async (event) => {
    event.preventDefault();

    const { txHash, txMethod } = await initializeFestival(
      owner,
      chainId,
      festivalStartTime,
      festivalEndTime,
    );

    dispatch(
      addPendingTransaction({
        txHash,
        txMethod,
        params: { chainId },
      }),
    );
  };

  const onChangeStartTime = async (datetime) => {
    setFestivalStartTime(datetime);
  };

  const onChangeEndTime = async (datetime) => {
    setFestivalEndTime(datetime);
  };

  return (
    <div>
      <ButtonOutline onClick={onClick}>Initialize Festival</ButtonOutline>
      <DateTimePicker value={festivalStartTime} onChange={onChangeStartTime} />
      <DateTimePicker value={festivalEndTime} onChange={onChangeEndTime} />
    </div>
  );
};

const ContractsFestivals = ({ chainId }) => {
  // const dispatch = useDispatch();

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

  return (
    <EthereumContainer>
      {!isInitialized ? (
        <InitializeFestival chainId={chainId} owner={owner} />
      ) : null}
    </EthereumContainer>
  );
};

InitializeFestival.propTypes = {
  chainId: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
};

ContractsFestivals.propTypes = {
  chainId: PropTypes.string.isRequired,
};

export default ContractsFestivals;
