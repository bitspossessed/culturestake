import { createGlobalStyle } from 'styled-components';

import styles from '~/client/styles/variables';

export default createGlobalStyle`
  a {
    color: ${styles.links.color};

    font-weight: ${styles.links.fontWeight};

    text-decoration: none;
  }
`;
