import styled, { createGlobalStyle } from 'styled-components';

import styles from '~/client/styles/variables';

export default createGlobalStyle`
  html {
    font-size: 62.5%;
  }

  body {
    font-weight: ${styles.typography.weight};
    font-style: ${styles.typography.style};
    font-size: ${styles.typography.size};
    font-family: ${styles.typography.family}, sans-serif;

    line-height: ${styles.typography.lineHeight};
  }

  p {
    margin: 0 auto;
    padding: 0;

    + p {
      margin-top: 1rem;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: ${styles.typography.weight};
    font-family: ${styles.typography.familyHeading}, sans-serif;
  }
`;

export const ParagraphStyle = styled.p`
  margin: ${styles.layout.spacing};
`;

export const HeadingPrimaryStyle = styled.h1`
  margin: ${styles.layout.spacing};

  font-size: 3em;
`;

export const HeadingSecondaryStyle = styled.h2`
  margin: ${styles.layout.spacing};

  font-size: 1.5em;
`;
