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

const Spinner = () => {
  const [snuggleness, setSnuggleness] = useState(0);

  const randomSnuggleness = () => {
    setSnuggleness(Math.round(Math.random() * SNUGGLEPUNKS_COUNT));
  };

  useEffect(() => {
    randomSnuggleness();
  }, []);

  return (
    <SpinnerStyle onClick={randomSnuggleness}>
      <SpinnerInnerStyle>
        <use xlinkHref={`#snugglepunk-${snuggleness}`} />
      </SpinnerInnerStyle>
    </SpinnerStyle>
  );
};

const SpinnerStyle = styled.div`
  cursor: pointer;
`;

const SpinnerInnerStyle = styled.svg`
  position: relative;

  width: 4rem;
  height: 4rem;

  animation: ${rotate} 2s linear infinite;
  animation-direction: reverse;
`;

export default Spinner;
