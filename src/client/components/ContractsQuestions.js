import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { MAX_VOTE_TOKENS } from '~/common/utils/constants';
import translate from '~/common/services/i18n';
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

const ContractsQuestions = ({ questionAddress, festivalChainId }) => {
  const dispatch = useDispatch();

  const { isPending } = usePendingTransaction({
    txMethod: TX_INITIALIZE_QUESTION,
    params: { festivalChainId },
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

  const onClick = async (event) => {
    event.preventDefault();

    const { txHash, txMethod } = await initializeQuestion(
      owner,
      MAX_VOTE_TOKENS,
      festivalChainId,
    );

    dispatch(
      addPendingTransaction({
        txHash,
        txMethod,
        params: { festivalChainId },
      }),
    );
  };

  return (
    <EthereumContainer>
      {!isInitialized ? (
        <div>
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
  festivalChainId: PropTypes.string.isRequired,
  questionAddress: PropTypes.string.isRequired,
};

export default ContractsQuestions;
