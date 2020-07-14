import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DateTimePicker from 'react-datetime-picker';
import styled from 'styled-components';

import styles from '~/client/styles/variables';
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

const ContractsFestivalsInitialize = ({ chainId }) => {
  const dispatch = useDispatch();
  const owner = useOwnerAddress();

  const [festivalStartTime, setFestivalStartTime] = useState(
    new Date(Date.now()),
  );
  const [festivalEndTime, setFestivalEndTime] = useState(new Date(Date.now()));

  const StyledDateTimePicker = styled(DateTimePicker)`
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

    border: 1.5px solid ${styles.colors.violet};

    color: ${styles.colors.violet};

    .react-datetime-picker__wrapper {
      border: none;
    }

    .react-datetime-picker__inputGroup__leadingZero {
      color: black;
    }
  `;

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
      <ButtonOutline onClick={onClick}>
        {translate('ContractsFestivals.buttonInitializeFestival')}
      </ButtonOutline>
      <StyledDateTimePicker
        value={festivalStartTime}
        onChange={setFestivalStartTime}
      />
      <StyledDateTimePicker
        value={festivalEndTime}
        onChange={setFestivalEndTime}
      />
    </div>
  );
};

const ContractsFestivalsDeactivate = ({ chainId }) => {
  const dispatch = useDispatch();
  const owner = useOwnerAddress();

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
      <ButtonOutline isDangerous={true} onClick={onClick}>
        {translate('ContractsFestivals.buttonDeactivateFestival')}
      </ButtonOutline>
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
        <ContractsFestivalsInitialize chainId={chainId} owner={owner} />
      ) : (
        <ContractsFestivalsDeactivate chainId={chainId} owner={owner} />
      )}
    </EthereumContainer>
  );
};

ContractsFestivalsDeactivate.propTypes = {
  chainId: PropTypes.string.isRequired,
};

ContractsFestivalsInitialize.propTypes = {
  chainId: PropTypes.string.isRequired,
};

ContractsFestivals.propTypes = {
  chainId: PropTypes.string.isRequired,
};

export default ContractsFestivals;
