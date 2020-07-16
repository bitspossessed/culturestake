import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

import { SNUGGLEPUNKS_COUNT } from '~/client/components/SVGDefinitions';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = (props) => {
  const [snuggleness, setSnuggleness] = useState(0);

  const randomSnuggleness = () => {
    setSnuggleness(Math.round(Math.random() * SNUGGLEPUNKS_COUNT));
  };

  useEffect(() => {
    randomSnuggleness();
  }, []);

  return (
    <SpinnerStyle onClick={randomSnuggleness}>
      <SpinnerInnerStyle isLarge={props.isLarge}>
        <use xlinkHref={`#snugglepunk-${snuggleness}`} />
      </SpinnerInnerStyle>
    </SpinnerStyle>
  );
};

const SpinnerStyle = styled.div`
  cursor: pointer;
`;

const SpinnerInnerStyle = styled.svg`
  width: ${(props) => (props.isLarge ? '10rem' : '4rem')};
  height: ${(props) => (props.isLarge ? '10rem' : '4rem')};

  animation: ${rotate} 2s linear infinite;
  animation-direction: reverse;
`;

Spinner.propTypes = {
  isLarge: PropTypes.bool,
};

export default Spinner;
