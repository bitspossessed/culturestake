import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';
import { ButtonClearStyle } from '~/client/components/ButtonClear';

// eslint-disable-next-line react/display-name
const ButtonOutline = React.forwardRef(
  ({ children, isDanger, ...props }, ref) => {
    return (
      <ButtonOutlineStyle {...props} isDanger={isDanger} ref={ref}>
        {children}
      </ButtonOutlineStyle>
    );
  },
);

export const ButtonOutlineStyle = styled(ButtonClearStyle)`
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;

  border: 1.5px solid
    ${(props) =>
      props.isDanger
        ? `${styles.colors.red} !important`
        : styles.colors.violet};

  color: ${(props) =>
    props.isDanger ? `${styles.colors.red} !important` : styles.colors.violet};

  & + & {
    margin-left: 0.5rem;
  }
`;

ButtonOutline.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  isDanger: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default ButtonOutline;
