import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import ButtonOutline from '~/client/components/ButtonOutline';
import Pill from '~/client/components/Pill';
import Spinner from '~/client/components/Spinner';
import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { enableAccount } from '~/client/store/ethereum/actions';
import {
  HeadingSecondaryStyle,
  ParagraphStyle,
} from '~/client/styles/typography';

const EthereumContainer = (props) => {
  const { account, hasProvider, isOwner } = useSelector(
    (state) => state.ethereum,
  );
  const dispatch = useDispatch();

  const onEnable = (event) => {
    event.preventDefault();
    dispatch(enableAccount());
  };

  return (
    <EthereumContainerStyle disabled={!hasProvider}>
      <HeadingSecondaryStyle>
        {translate('EthereumContainer.title')}
      </HeadingSecondaryStyle>

      {props.isPending && (
        <EthereumContainerSpinnerStyle>
          <Spinner />
        </EthereumContainerSpinnerStyle>
      )}

      {hasProvider ? (
        <Fragment>
          {account ? (
            <Fragment>
              <ParagraphStyle>
                {translate('EthereumContainer.bodyYourAddress')}{' '}
                <Pill>{account}</Pill>
              </ParagraphStyle>

              <EthereumContainerInnerStyle>
                {isOwner ? (
                  props.children
                ) : (
                  <ParagraphStyle>
                    {translate('EthereumContainer.bodyIsNotOwner')}
                  </ParagraphStyle>
                )}
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
    </EthereumContainerStyle>
  );
};

EthereumContainer.propTypes = {
  children: PropTypes.node,
  isPending: PropTypes.bool,
};

export const EthereumContainerStyle = styled.section`
  position: relative;

  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;

  border: 1.5px solid
    ${(props) => (props.disabled ? styles.colors.gray : styles.colors.violet)};
  border-radius: 20px;

  color: ${(props) =>
    props.disabled ? styles.colors.gray : styles.colors.violet};
`;

const EthereumContainerSpinnerStyle = styled.div`
  position: absolute;

  top: 0;
  right: 0;

  padding: 1rem;
`;

export const EthereumContainerInnerStyle = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;

  border-top: 1.5px solid ${styles.colors.violet};
`;

export default EthereumContainer;
