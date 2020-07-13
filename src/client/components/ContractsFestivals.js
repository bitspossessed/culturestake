import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DateTimePicker from 'react-datetime-picker';

import translate from '~/common/services/i18n';
import ButtonOutline from '~/client/components/ButtonOutline';
import EthereumContainer from '~/client/components/EthereumContainer';
import { addPendingTransaction } from '~/client/store/ethereum/actions';
import {
  isFestivalInitialized,
  initializeFestival,
  TX_INITIALIZE_FESTIVAL,
  isFestivalDeactivated,
  deactivateFestival,
  TX_DEACTIVATE_FESTIVAL,
} from '~/common/services/contracts/festivals';
import {
  usePendingTransaction,
  useOwnerAddress,
} from '~/client/hooks/ethereum';

const InitializeFestival = ({ chainId, owner }) => {
  const dispatch = useDispatch();

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

  return (
    <div>
      <ButtonOutline onClick={onClick}>Initialize Festival</ButtonOutline>
      <DateTimePicker
        value={festivalStartTime}
        onChange={setFestivalStartTime}
      />
      <DateTimePicker value={festivalEndTime} onChange={setFestivalEndTime} />
    </div>
  );
};

const DeactivateFestival = ({ chainId, owner }) => {
  const dispatch = useDispatch();

  const onClick = async (event) => {
    event.preventDefault();

    const { txHash, txMethod } = await deactivateFestival(owner, chainId);

    dispatch(
      addPendingTransaction({
        txHash,
        txMethod,
        params: { chainId },
      }),
    );
  };

  return (
    <div>
      <ButtonOutline onClick={onClick}>Deactivate Festival</ButtonOutline>
    </div>
  );
};

const ContractsFestivals = ({ chainId }) => {
  const initializeTx = usePendingTransaction({
    txMethod: TX_INITIALIZE_FESTIVAL,
    params: { chainId },
  });
  const deactivateTx = usePendingTransaction({
    txMethod: TX_DEACTIVATE_FESTIVAL,
    params: { chainId },
  });
  const owner = useOwnerAddress();

  const [isInitialized, setIsInitialized] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);

  useEffect(() => {
    const getInitializedStatus = async () => {
      const state = await isFestivalInitialized(chainId);
      setIsInitialized(state);
    };
    getInitializedStatus();
  }, [chainId, initializeTx.isPending]);

  useEffect(() => {
    const getDeactivatedStatus = async () => {
      const state = await isFestivalDeactivated(chainId);
      setIsDeactivated(state);
    };
    getDeactivatedStatus();
  }, [chainId, deactivateTx.isPending]);

  return (
    <EthereumContainer>
      {isDeactivated ? (
        translate('ContractsFestivals.notificationAlreadyDeactivated')
      ) : !isInitialized ? (
        <InitializeFestival chainId={chainId} owner={owner} />
      ) : (
        <DeactivateFestival chainId={chainId} owner={owner} />
      )}
    </EthereumContainer>
  );
};

DeactivateFestival.propTypes = {
  chainId: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
};

InitializeFestival.propTypes = {
  chainId: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
};

ContractsFestivals.propTypes = {
  chainId: PropTypes.string.isRequired,
};

export default ContractsFestivals;
