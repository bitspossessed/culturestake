import { createGlobalStyle } from 'styled-components';

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
`;
