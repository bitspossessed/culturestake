import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Button from '~/client/components/Button';
import styles from '~/client/styles/variables';

// eslint-disable-next-line react/display-name
const ButtonClear = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <ButtonClearStyle {...props} ref={ref}>
      {children}
    </ButtonClearStyle>
  );
});

export const ButtonClearStyle = styled(Button)`
  min-width: 2rem;

  padding: 0;

  border: 0;

  color: ${(props) =>
    props.isDangerous ? styles.colors.red : styles.colors.violet};

  background-color: transparent;

  opacity: ${(props) => {
    return props.disabled ? '0.3' : '1';
  }};

  cursor: pointer;

  text-overflow: ellipsis;
`;

ButtonClear.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isDangerous: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default ButtonClear;
