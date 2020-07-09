import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import ButtonOutline from '~/client/components/ButtonOutline';
import Pill from '~/client/components/Pill';
import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { enableAccount } from '~/client/store/ethereum/actions';
import {
  HeadingSecondaryStyle,
  ParagraphStyle,
} from '~/client/styles/typography';

const EthereumContainer = (props) => {
  const { account, provider } = useSelector((state) => state.ethereum);
  const dispatch = useDispatch();

  const onEnable = () => {
    dispatch(enableAccount());
  };

  return (
    <ContractOwnerContainerStyle disabled={!provider}>
      <HeadingSecondaryStyle>
        {translate('EthereumContainer.title')}
      </HeadingSecondaryStyle>

      {provider ? (
        <Fragment>
          {account ? (
            <Fragment>
              <ParagraphStyle>
                {translate('EthereumContainer.bodyYourAddress')}{' '}
                <Pill>{account}</Pill>
              </ParagraphStyle>

              <EthereumContainerInnerStyle>
                {props.children}
              </EthereumContainerInnerStyle>
            </Fragment>
          ) : (
            <Fragment>
              <ButtonOutline onClick={onEnable}>
                {translate('EthereumContainer.buttonEnable')}
              </ButtonOutline>
            </Fragment>
          )}
        </Fragment>
      ) : (
        <ParagraphStyle>
          {translate('EthereumContainer.bodyInstallMetamask')}
        </ParagraphStyle>
      )}
    </ContractOwnerContainerStyle>
  );
};

EthereumContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const ContractOwnerContainerStyle = styled.section`
  padding: 1rem;

  border: 1.5px solid
    ${(props) => (props.disabled ? styles.colors.gray : styles.colors.violet)};
  border-radius: 20px;

  color: ${(props) =>
    props.disabled ? styles.colors.gray : styles.colors.violet};
`;

const EthereumContainerInnerStyle = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;

  border-top: 1.5px solid ${styles.colors.violet};
`;

export default EthereumContainer;
