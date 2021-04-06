import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';

import Button from '~/client/components/Button';
import InlineSVG from '~/client/components/InlineSVG';
import dots from '~/client/assets/images/dots.svg';

// eslint-disable-next-line react/display-name
const ButtonMore = React.forwardRef((props, ref) => {
  return (
    <Suspense fallback={null}>
      <ButtonMoreStyle {...props} ref={ref}>
        <InlineSVG url={dots} />
      </ButtonMoreStyle>
    </Suspense>
  );
});

export const ButtonMoreStyle = styled(Button)`
  width: 3rem;
  height: 3rem;

  padding: 0;

  border: 0;

  background-color: transparent;

  opacity: ${(props) => {
    return props.isDisabled ? '0.3' : '1';
  }};

  cursor: pointer;
`;

ButtonMore.propTypes = {
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default ButtonMore;
