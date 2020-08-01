import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import ButtonOutline from '~/client/components/ButtonOutline';
import EthereumContainer from '~/client/components/EthereumContainer';
import translate from '~/common/services/i18n';
import { MAX_VOTE_TOKENS } from '~/common/utils/constants';
import { ParagraphStyle } from '~/client/styles/typography';
import {
  TX_DEACTIVATE_QUESTION,
  TX_INITIALIZE_QUESTION,
  deactivateQuestion,
  initializeQuestion,
  isQuestionDeactivated,
  isQuestionInitialized,
} from '~/common/services/contracts/questions';
import { addPendingTransaction } from '~/client/store/ethereum/actions';
import {
  usePendingTransaction,
  useOwnerAddress,
} from '~/client/hooks/ethereum';

const ContractsQuestions = ({
  festivalChainId,
  isInitialized,
  questionChainId,
  setIsInitialized,
}) => {
  const initializeTx = usePendingTransaction({
    txMethod: TX_INITIALIZE_QUESTION,
    params: { questionChainId },
  });
  const deactivateTx = usePendingTransaction({
    txMethod: TX_DEACTIVATE_QUESTION,
    params: { questionChainId },
  });

  const [isDeactivated, setIsDeactivated] = useState(false);

  useEffect(() => {
    const getInitializedStatus = async () => {
      if (questionChainId !== '') {
        const state = await isQuestionInitialized(questionChainId);
        setIsInitialized(state);
      }
    };

    getInitializedStatus();
  }, [questionChainId, initializeTx.isPending, setIsInitialized]);

  useEffect(() => {
    const getDeactivatedStatus = async () => {
      const state = await isQuestionDeactivated(questionChainId);
      setIsDeactivated(state);
    };

    getDeactivatedStatus();
  }, [questionChainId, deactivateTx.isPending]);

  return (
    <EthereumContainer>
      {isDeactivated ? (
        <ParagraphStyle>
          {translate('ContractsQuestions.notificationAlreadyDeactivated')}
        </ParagraphStyle>
      ) : !isInitialized ? (
        <ContractsQuestionsInitialize
          festivalChainId={festivalChainId}
          questionChainId={questionChainId}
        />
      ) : (
        <ContractsQuestionsDeactivate questionChainId={questionChainId} />
      )}
    </EthereumContainer>
  );
};

const ContractsQuestionsInitialize = ({ questionChainId, festivalChainId }) => {
  const dispatch = useDispatch();
  const owner = useOwnerAddress();

  const onClick = async (event) => {
    event.preventDefault();

    const { txHash, txMethod } = await initializeQuestion(
      owner,
      questionChainId,
      MAX_VOTE_TOKENS,
      festivalChainId,
    );

    dispatch(
      addPendingTransaction({
        txHash,
        txMethod,
        params: { questionChainId },
      }),
    );
  };

  return (
    <ButtonOutline onClick={onClick}>
      {translate('ContractsQuestions.buttonInitializeQuestion')}
    </ButtonOutline>
  );
};

const ContractsQuestionsDeactivate = ({ questionChainId }) => {
  const dispatch = useDispatch();
  const owner = useOwnerAddress();

  const onClick = async (event) => {
    event.preventDefault();

    const { txHash, txMethod } = await deactivateQuestion(
      owner,
      questionChainId,
    );

    dispatch(
      addPendingTransaction({
        txHash,
        txMethod,
        params: { questionChainId },
      }),
    );
  };

  return (
    <ButtonOutline isDanger onClick={onClick}>
      {translate('ContractsQuestions.buttonDeactivateQuestion')}
    </ButtonOutline>
  );
};

ContractsQuestionsInitialize.propTypes = {
  festivalChainId: PropTypes.string.isRequired,
  questionChainId: PropTypes.string.isRequired,
};

ContractsQuestionsDeactivate.propTypes = {
  questionChainId: PropTypes.string.isRequired,
};

ContractsQuestions.propTypes = {
  festivalChainId: PropTypes.string.isRequired,
  isInitialized: PropTypes.bool.isRequired,
  questionChainId: PropTypes.string.isRequired,
  setIsInitialized: PropTypes.func.isRequired,
};

export default ContractsQuestions;
