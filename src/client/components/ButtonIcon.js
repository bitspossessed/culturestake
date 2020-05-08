import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Button from '~/client/components/Button';
import arrow from '~/client/assets/images/arrow.svg';
import styles from '~/client/styles/variables';

// eslint-disable-next-line react/display-name
const ButtonIcon = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <ButtonIconStyle {...props} ref={ref}>
      {children}
    </ButtonIconStyle>
  );
});

const ButtonIconStyle = styled(Button)`
  position: relative;

  overflow: hidden;

  width: 100%;
  height: 3rem;

  padding: 0.5rem;
  ${(props) => {
    return props.isIconLeft ? 'padding-left' : 'padding-right';
  }}: 3.5rem;

  border: 1px solid ${styles.colors.violet};

  color: ${styles.colors.violet};

  background-color: transparent;

  opacity: ${(props) => {
    return props.disabled ? '0.3' : '1';
  }};

  cursor: pointer;

  text-overflow: ellipsis;

  &::after {
    position: absolute;

    top: -1px;
    ${(props) => {
      return props.isIconLeft ? 'left' : 'right';
    }}: 0;

    display: block;

    width: 3rem;
    height: 3rem;

    ${(props) => {
      return props.isIconLeft !== props.isIconFlipped
        ? 'border-right'
        : 'border-left';
    }}: 1px solid ${styles.colors.violet};

    content: '';

    background-image: url(${arrow});
    background-repeat: no-repeat;
    background-position: center;
    background-size: 65%;

    transform: rotate(
      ${(props) => {
        return props.isIconFlipped ? '180' : '0';
      }}deg
    );
  }
`;

ButtonIcon.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isIconFlipped: PropTypes.bool,
  isIconLeft: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default ButtonIcon;
