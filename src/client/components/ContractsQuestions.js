import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import styled from 'styled-components';

// import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import Finder from '~/client/components/Finder';
import ButtonOutline from '~/client/components/ButtonOutline';
import EthereumContainer from '~/client/components/EthereumContainer';
import { addPendingTransaction } from '~/client/store/ethereum/actions';
import {
  initializeQuestion,
  isQuestionInitialized,
  TX_INITIALIZE_QUESTION,
} from '~/common/services/contracts/questions';
import {
  usePendingTransaction,
  useOwnerAddress,
} from '~/client/hooks/ethereum';

const ContractsQuestions = ({ questionAddress }) => {
  const dispatch = useDispatch();

  const [festival, setFestival] = useState({});

  const { isPending } = usePendingTransaction({
    txMethod: TX_INITIALIZE_QUESTION,
    params: { festivalChainId: festival.chainId },
  });

  const owner = useOwnerAddress();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const getInitializedStatus = async () => {
      const state = await isQuestionInitialized(questionAddress);
      setIsInitialized(state);
    };
    getInitializedStatus();
  }, [questionAddress, isPending]);

  const onInputChange = (value) => {
    console.log('onInputChange in forms questions'); // eslint-disable-line
    console.log(value); // eslint-disable-line
    setFestival(value);
  };

  const onSelect = (value) => {
    // console.log('onInputChange in forms questions'); // eslint-disable-line
    console.log(value); // eslint-disable-line
    onInputChange(value);
    setFestival(value);
  };

  const onClick = async (event) => {
    event.preventDefault();

    const { txHash, txMethod } = await initializeQuestion(
      owner,
      festival.chainId,
    );

    dispatch(
      addPendingTransaction({
        txHash,
        txMethod,
        params: { festivalChainId: festival.chainId },
      }),
    );
  };

  return (
    <EthereumContainer>
      {!isInitialized ? (
        <div>
          <ButtonOutline onClick={onClick}>
            {translate('ContractsFestivals.buttonInitializeFestival')}
          </ButtonOutline>
          <Finder
            id={festival.id ? festival.id : 0}
            input={''}
            label={translate('FormQuestions.fieldFestival')}
            name="festival Id"
            queryPath={'festivals'}
            type="text"
            value={''}
            onInputChange={onInputChange}
            onSelect={onSelect}
          />
        </div>
      ) : (
        <br />
      )}
    </EthereumContainer>
  );

  // return (
  //   <EthereumContainer>
  //     <ButtonOutline onClick={onClick}>
  //       {translate('ContractsFestivals.buttonInitializeFestival')}
  //     </ButtonOutline>
  //   </EthereumContainer>
  // );
};

ContractsQuestions.propTypes = {
  questionAddress: PropTypes.string.isRequired,
};

export default ContractsQuestions;
