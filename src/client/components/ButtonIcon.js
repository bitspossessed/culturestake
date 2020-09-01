import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';

import Button from '~/client/components/Button';
import InlineSVG from '~/client/components/InlineSVG';
import arrow from '~/client/assets/images/arrow.svg';
import styles from '~/client/styles/variables';

// eslint-disable-next-line react/display-name
const ButtonIcon = React.forwardRef(
  ({ children, isIconFlipped = false, url = arrow, ...props }, ref) => {
    return (
      <ButtonIconStyle {...props} ref={ref}>
        {children}

        <Suspense fallback={null}>
          <ButtonIconSVGStyle isIconFlipped={isIconFlipped}>
            <InlineSVG url={url} />
          </ButtonIconSVGStyle>
        </Suspense>
      </ButtonIconStyle>
    );
  },
);

export const ButtonIconStyle = styled(Button)`
  position: relative;

  overflow: hidden;

  width: 100%;
  height: 3rem;

  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  padding-right: 3.5rem;

  border: 1.5px solid ${styles.colors.black};

  background-color: transparent;

  opacity: ${(props) => {
    return props.disabled ? '0.3' : '1';
  }};

  cursor: pointer;

  text-overflow: ellipsis;
`;

export const ButtonIconSVGStyle = styled.div`
  position: absolute;

  top: -1px;
  ${(props) => {
    return props.isIconLeft ? 'left' : 'right';
  }}: 0;

  width: 3rem;
  height: 3rem;

  padding-top: 0.5rem;

  ${(props) => {
    return props.isIconFlipped ? 'border-right' : 'border-left';
  }}: 1.5px solid ${styles.colors.black};

  transform: rotate(
    ${(props) => {
      return props.isIconFlipped ? '180' : '0';
    }}deg
  );

  svg {
    width: 2rem;
    height: 2rem;
  }
`;

ButtonIcon.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  isIconFlipped: PropTypes.bool,
  isIconLeft: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
  url: PropTypes.string,
};

export default ButtonIcon;
