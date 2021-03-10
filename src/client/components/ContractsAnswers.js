import PropTypes from 'prop-types';
import React from 'react';

import ButtonOutline from '~/client/components/ButtonOutline';
import EthereumContainer from '~/client/components/EthereumContainer';
import { ParagraphStyle } from '~/client/styles/typography';
import InitializeAnswer from '~/client/components/InitializeAnswer';
import translate from '~/common/services/i18n';

const ContractsAnswers = ({
  answerChainId,
  handleDeactivate,
  questionChainId,
}) => {
  return (
    <EthereumContainer>
      <InitializeAnswer
        answerChainId={answerChainId}
        handleDeactivate={handleDeactivate}
        questionChainId={questionChainId}
      >
        {({ isInitialized, isDeactivated, onInitialize, onDeactivate }) => {
          return (
            <>
              {isDeactivated ? (
                <ParagraphStyle>
                  {translate('ContractsAnswers.bodyAlreadyDeactivated')}
                </ParagraphStyle>
              ) : isInitialized ? (
                <ButtonOutline isDanger={true} onClick={onDeactivate}>
                  {translate('ContractsAnswers.buttonDeactivateAnswer')}
                </ButtonOutline>
              ) : (
                <ButtonOutline onClick={onInitialize}>
                  {translate('ContractsAnswers.buttonInitializeAnswer')}
                </ButtonOutline>
              )}
            </>
          );
        }}
      </InitializeAnswer>
    </EthereumContainer>
  );
};

ContractsAnswers.propTypes = {
  answerChainId: PropTypes.string.isRequired,
  handleDeactivate: PropTypes.func,
  questionChainId: PropTypes.string.isRequired,
};

export default ContractsAnswers;
