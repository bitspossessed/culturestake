import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import translate from '~/common/services/i18n';
import ButtonOutline from '~/client/components/ButtonOutline';
import EthereumContainer from '~/client/components/EthereumContainer';
import { addPendingTransaction } from '~/client/store/ethereum/actions';
import {
  initializeAnswer,
  isAnswerInitialized,
  TX_INITIALIZE_ANSWER,
  deactivateAnswer,
  isAnswerDeactivated,
  TX_DEACTIVATE_ANSWER,
} from '~/common/services/contracts/answers';
import {
  usePendingTransaction,
  useOwnerAddress,
} from '~/client/hooks/ethereum';

const ContractsAnswersInitialize = ({ questionChainId, answerChainId }) => {
  const dispatch = useDispatch();
  const owner = useOwnerAddress();

  const onClick = async (event) => {
    event.preventDefault();

    const { txHash, txMethod } = await initializeAnswer(
      owner,
      questionChainId,
      answerChainId,
    );

    dispatch(
      addPendingTransaction({
        txHash,
        txMethod,
        params: { answerChainId },
      }),
    );
  };

  return (
    <div>
      <ButtonOutline onClick={onClick}>
        {translate('ContractsQuestions.buttonInitializeQuestion')}
      </ButtonOutline>
    </div>
  );
};

const ContractsAnswersDeactivate = ({ questionChainId, answerChainId }) => {
  const dispatch = useDispatch();
  const owner = useOwnerAddress();

  const onClick = async (event) => {
    event.preventDefault();

    const { txHash, txMethod } = await deactivateAnswer(
      owner,
      questionChainId,
      answerChainId,
    );

    dispatch(
      addPendingTransaction({
        txHash,
        txMethod,
        params: { answerChainId },
      }),
    );
  };

  return (
    <div>
      <ButtonOutline isDangerous={true} onClick={onClick}>
        {translate('ContractsQuestions.buttonDeactivateQuestion')}
      </ButtonOutline>
    </div>
  );
};

const ContractsAnswers = ({ questionChainId, answerChainId }) => {
  const initializeTx = usePendingTransaction({
    txMethod: TX_INITIALIZE_ANSWER,
    params: { answerChainId },
  });
  const deactivateTx = usePendingTransaction({
    txMethod: TX_DEACTIVATE_ANSWER,
    params: { answerChainId },
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);

  useEffect(() => {
    const getInitializedStatus = async () => {
      if (questionChainId !== '') {
        const state = await isAnswerInitialized(questionChainId, answerChainId);
        setIsInitialized(state);
      }
    };
    getInitializedStatus();
  }, [questionChainId, answerChainId, initializeTx.isPending]);

  useEffect(() => {
    const getDeactivatedStatus = async () => {
      const state = await isAnswerDeactivated(questionChainId, answerChainId);
      setIsDeactivated(state);
    };
    getDeactivatedStatus();
  }, [questionChainId, answerChainId, deactivateTx.isPending]);

  return (
    <EthereumContainer>
      {isDeactivated ? (
        translate('ContractsQuestions.notificationAlreadyDeactivated')
      ) : !isInitialized ? (
        <ContractsAnswersInitialize
          answerChainId={answerChainId}
          questionChainId={questionChainId}
        />
      ) : (
        <ContractsAnswersDeactivate
          answerChainId={answerChainId}
          questionChainId={questionChainId}
        />
      )}
    </EthereumContainer>
  );
};

ContractsAnswersInitialize.propTypes = {
  answerChainId: PropTypes.string.isRequired,
  questionChainId: PropTypes.string.isRequired,
};

ContractsAnswersDeactivate.propTypes = {
  answerChainId: PropTypes.string.isRequired,
  questionChainId: PropTypes.string.isRequired,
};

ContractsAnswers.propTypes = {
  answerChainId: PropTypes.string.isRequired,
  questionChainId: PropTypes.string.isRequired,
};

export default ContractsAnswers;
