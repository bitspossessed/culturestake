import styled, { createGlobalStyle } from 'styled-components';

import styles from '~/client/styles/variables';

export default createGlobalStyle`
  html {
    font-size: 62.5%;
  }

  body {
    min-width: 360px;

    font-weight: ${styles.typography.weight};
    font-style: ${styles.typography.style};
    font-size: ${styles.typography.size};
    font-family: ${styles.typography.family}, sans-serif;

    line-height: ${styles.typography.lineHeight};
  }

  p {
    margin: 0;
    padding: 0;

    + p {
      @media ${styles.media.tablet} {
        margin-top: 2rem;
      }

      margin-top: 1.5rem;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    padding: 0;

    font-weight: ${styles.typography.weight};
    font-family: ${styles.typography.familyHeading}, sans-serif;

    overflow-wrap: anywhere;
  }
`;

export const ParagraphStyle = styled.p`
  @media ${styles.media.tablet} {
    font-weight: ${styles.typography.weightMedium};
    font-size: 1.2em;

    line-height: 1.2;
  }
`;

export const HeadingPrimaryStyle = styled.h1`
  margin-bottom: 1rem;

  font-size: 3em;

  line-height: 0.9;
`;

export const HeadingSecondaryStyle = styled.h2`
  margin-bottom: 1rem;

  font-size: 1.5em;

  line-height: 0.9;
`;

export const PreStyle = styled.pre`
  white-space: pre-line;
`;
