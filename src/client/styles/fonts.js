import { createGlobalStyle } from 'styled-components';

import styles from '~/client/styles/variables';

import data70Woff from '~/client/assets/fonts/data70-regular.woff';
import data70Woff2 from '~/client/assets/fonts/data70-regular.woff2';
import montserratWoff from '~/client/assets/fonts/montserrat-regular.woff';
import montserratWoff2 from '~/client/assets/fonts/montserrat-regular.woff2';
import myriadProWoff from '~/client/assets/fonts/myriadpro-regular.woff';
import myriadProWoff2 from '~/client/assets/fonts/myriadpro-regular.woff2';

export default createGlobalStyle`
  @font-face {
    font-weight: ${styles.typography.weight};
    font-style: ${styles.typography.style};
    font-family: ${styles.typography.family};

    src:
      url(${montserratWoff2}) format('woff2'),
      url(${montserratWoff}) format('woff');
  }

  @font-face {
    font-weight: ${styles.typography.weight};
    font-style: ${styles.typography.style};
    font-family: ${styles.typography.familyAccessible};

    src:
      url(${myriadProWoff2}) format('woff2'),
      url(${myriadProWoff}) format('woff');
  }

  @font-face {
    font-weight: ${styles.typography.weight};
    font-style: ${styles.typography.style};
    font-family: ${styles.typography.familyHeading};

    src:
      url(${data70Woff2}) format('woff2'),
      url(${data70Woff}) format('woff');
  }

`;
