import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

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

const InitializeAnswer = ({
  questionChainId,
  answerChainId,
  children,
  handleDeactivate = () => {},
  handleInitialize = () => {},
}) => {
  const dispatch = useDispatch();
  const owner = useOwnerAddress();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);

  const initializeTx = usePendingTransaction({
    txMethod: TX_INITIALIZE_ANSWER,
    params: { answerChainId },
  });
  const deactivateTx = usePendingTransaction({
    txMethod: TX_DEACTIVATE_ANSWER,
    params: { answerChainId },
  });

  useEffect(() => {
    const getInitializedStatus = async () => {
      if (questionChainId !== '') {
        const state = await isAnswerInitialized(questionChainId, answerChainId);
        setIsInitialized(state);
        handleInitialize(state);
      }
    };

    getInitializedStatus();
  }, [
    questionChainId,
    answerChainId,
    initializeTx.isPending,
    handleInitialize,
  ]);

  useEffect(() => {
    const getDeactivatedStatus = async () => {
      const state = await isAnswerDeactivated(questionChainId, answerChainId);
      setIsDeactivated(state);
      handleDeactivate(state);
    };

    getDeactivatedStatus();
  }, [
    questionChainId,
    answerChainId,
    deactivateTx.isPending,
    handleDeactivate,
  ]);

  const onInitialize = async (event) => {
    event.stopPropagation();
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

  const onDeactivate = async (event) => {
    event.stopPropagation();
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

  return children({
    isInitialized,
    isDeactivated,
    onInitialize,
    onDeactivate,
  });
};

InitializeAnswer.propTypes = {
  answerChainId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  handleDeactivate: PropTypes.func,
  handleInitialize: PropTypes.func,
  questionChainId: PropTypes.string.isRequired,
};

export default InitializeAnswer;
