import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { MAX_VOTE_TOKENS } from '~/common/utils/constants';
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
      if (questionAddress !== '') {
        const state = await isQuestionInitialized(questionAddress);
        setIsInitialized(state);
      }
    };
    getInitializedStatus();
  }, [questionAddress, isPending]);

  const onInputChange = (value) => {
    setFestival(value);
  };

  const onSelect = (value) => {
    setFestival(value);
  };

  const onClick = async (event) => {
    event.preventDefault();

    const { txHash, txMethod } = await initializeQuestion(
      owner,
      MAX_VOTE_TOKENS,
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
          <Finder
            label={translate('ContractsQuestions.fieldFestival')}
            name="festival"
            placeholder={translate('ContractsQuestions.fieldPlaceholder')}
            queryPath={'festivals'}
            onInputChange={onInputChange}
            onSelect={onSelect}
          />
          <ButtonOutline onClick={onClick}>
            {translate('ContractsQuestions.buttonInitializeQuestion')}
          </ButtonOutline>
        </div>
      ) : (
        <br />
      )}
    </EthereumContainer>
  );
};

ContractsQuestions.propTypes = {
  questionAddress: PropTypes.string.isRequired,
};

export default ContractsQuestions;
