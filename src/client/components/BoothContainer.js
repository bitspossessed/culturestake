import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import ButtonOutline from '~/client/components/ButtonOutline';
import Pill from '~/client/components/Pill';
import Spinner from '~/client/components/Spinner';
import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { ContainerStyle } from '~/client/styles/layout';
import {
  HeadingSecondaryStyle,
  ParagraphStyle,
} from '~/client/styles/typography';
import { initializeBooth, resetBooth } from '~/client/store/booth/actions';

const BoothContainer = (props) => {
  const dispatch = useDispatch();
  const booth = useSelector((state) => state.booth);

  const onInitializeBooth = () => {
    dispatch(initializeBooth());
  };

  const onBurnBooth = () => {
    if (!window.confirm(translate('default.areYouSure'))) {
      return;
    }

    dispatch(resetBooth());
  };

  return booth.isInitialized && !booth.isDeactivated ? (
    props.children
  ) : (
    <BoothContainerStyle>
      <HeadingSecondaryStyle>
        {translate('BoothContainer.title')}
      </HeadingSecondaryStyle>

      {booth.address ? (
        <Fragment>
          <ParagraphStyle>
            {translate('BoothContainer.bodyYourAddress')}{' '}
            <Pill>{booth.address}</Pill>
          </ParagraphStyle>

          <BoothContainerInnerStyle>
            {!booth.isInitialized && (
              <Fragment>
                <ParagraphStyle>
                  {translate('BoothContainer.bodyPendingInitialization')}
                </ParagraphStyle>

                <BoothContainerSpinnerStyle>
                  <Spinner />
                </BoothContainerSpinnerStyle>
              </Fragment>
            )}

            {booth.isDeactivated && (
              <Fragment>
                <ParagraphStyle>
                  {translate('BoothContainer.bodyBoothIsDeactivated')}
                </ParagraphStyle>

                <ButtonOutline onClick={onBurnBooth}>
                  {translate('BoothContainer.buttonBurnBooth')}
                </ButtonOutline>
              </Fragment>
            )}
          </BoothContainerInnerStyle>
        </Fragment>
      ) : (
        <ButtonOutline onClick={onInitializeBooth}>
          {translate('BoothContainer.buttonInitializeBooth')}
        </ButtonOutline>
      )}
    </BoothContainerStyle>
  );
};

BoothContainer.propTypes = {
  children: PropTypes.node.isRequired,
  isPending: PropTypes.bool,
};

export const BoothContainerStyle = styled(ContainerStyle)`
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

const BoothContainerSpinnerStyle = styled.div`
  position: absolute;

  top: 0;
  right: 0;

  padding: 1rem;
`;

export const BoothContainerInnerStyle = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;

  border-top: 1.5px solid ${styles.colors.violet};
`;

export default BoothContainer;
