import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Button from '~/client/components/Button';
import dots from '~/client/assets/images/dots.svg';

// eslint-disable-next-line react/display-name
const ButtonMore = React.forwardRef((props, ref) => {
  return <ButtonMoreStyle {...props} ref={ref} />;
});

const ButtonMoreStyle = styled(Button)`
  width: 3rem;
  height: 3rem;

  padding: 0;

  border: 0;

  color: transparent;

  background-color: transparent;
  background-image: url(${dots});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  opacity: ${(props) => {
    return props.disabled ? '0.3' : '1';
  }};

  cursor: pointer;
`;

ButtonMore.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default ButtonMore;
