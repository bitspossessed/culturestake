import React, { Suspense } from 'react';
import styled from 'styled-components';

import InlineSVG from '~/client/components/InlineSVG';
import dotline from '~/client/assets/images/dotline.svg';
import styles from '~/client/styles/variables';

const HorizontalLine = () => {
  return (
    <Suspense fallback={null}>
      <HorizontalLineStyle>
        <InlineSVG url={dotline} />
      </HorizontalLineStyle>
    </Suspense>
  );
};

export const HorizontalLineStyle = styled.div`
  @media ${styles.media.tablet} {
    margin: 3rem auto;
  }

  overflow: hidden;

  max-width: 66rem;
  height: 1.5rem;

  margin: 2rem auto;

  border: 0;

  svg {
    min-width: 33rem;
  }
`;

export default HorizontalLine;
