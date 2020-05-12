import styled, { createGlobalStyle } from 'styled-components';

import styles, {
  DEFAULT_SCHEME,
  SCHEME_ALTERNATE,
} from '~/client/styles/variables';

export default createGlobalStyle`
  #app,
  html,
  body {
    height: 100%;

    background-color: ${(props) => {
      return props.isAlternateColor
        ? styles.schemes[SCHEME_ALTERNATE].background
        : styles.schemes[DEFAULT_SCHEME].background;
    }};
  }
`;

export const BackgroundAreaStyle = styled.div`
  background-color: ${(props) => {
    return props.isAlternateColor
      ? styles.schemes[SCHEME_ALTERNATE].foreground
      : styles.schemes[DEFAULT_SCHEME].foreground;
  }};
`;

export const ContainerStyle = styled.div`
  padding: ${styles.layout.spacing};
`;
