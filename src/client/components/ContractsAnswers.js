import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import ButtonOutline from '~/client/components/ButtonOutline';
import EthereumContainer from '~/client/components/EthereumContainer';
import translate from '~/common/services/i18n';
import { ParagraphStyle } from '~/client/styles/typography';
import {
  TX_DEACTIVATE_ANSWER,
  TX_INITIALIZE_ANSWER,
  deactivateAnswer,
  initializeAnswer,
  isAnswerDeactivated,
  isAnswerInitialized,
} from '~/common/services/contracts/answers';
import { addPendingTransaction } from '~/client/store/ethereum/actions';
import {
  usePendingTransaction,
  useOwnerAddress,
} from '~/client/hooks/ethereum';

const ContractsAnswers = ({
  questionChainId,
  answerChainId,
  setIsDeactivated,
  isDeactivated,
}) => {
  const initializeTx = usePendingTransaction({
    txMethod: TX_INITIALIZE_ANSWER,
    params: { answerChainId },
  });
  const deactivateTx = usePendingTransaction({
    txMethod: TX_DEACTIVATE_ANSWER,
    params: { answerChainId },
  });

  const [isInitialized, setIsInitialized] = useState(false);

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
  }, [
    questionChainId,
    answerChainId,
    deactivateTx.isPending,
    setIsDeactivated,
  ]);

  return (
    <EthereumContainer>
      {isDeactivated ? (
        <ParagraphStyle>
          {translate('ContractsAnswers.notificationAlreadyDeactivated')}
        </ParagraphStyle>
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
    <ButtonOutline onClick={onClick}>
      {translate('ContractsAnswers.buttonInitializeAnswer')}
    </ButtonOutline>
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
    <ButtonOutline isDanger={true} onClick={onClick}>
      {translate('ContractsAnswers.buttonDeactivateAnswer')}
    </ButtonOutline>
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
  isDeactivated: PropTypes.bool.isRequired,
  questionChainId: PropTypes.string.isRequired,
  setIsDeactivated: PropTypes.func.isRequired,
};

export default ContractsAnswers;
