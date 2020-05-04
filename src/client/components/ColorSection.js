import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';
import {
  HeadingPrimaryStyle,
  HeadingSecondaryStyle,
} from '~/client/styles/typography';
import { ParagraphStyle } from '~/client/styles/typography';

export const SCHEME_ALTERNATE = 'alternative';
export const SCHEME_BLACK = 'black';
export const SCHEME_PINK = 'pink';
export const SCHEME_VIOLET = 'violet';

export const DEFAULT_SCHEME = SCHEME_VIOLET;

const SCHEMES = {
  [SCHEME_ALTERNATE]: {
    background: styles.colors.black,
    foreground: styles.colors.yellow,
  },
  [SCHEME_BLACK]: {
    background: styles.colors.white,
    foreground: styles.colors.black,
  },
  [SCHEME_PINK]: {
    background: styles.colors.white,
    foreground: styles.colors.pink,
  },
  [SCHEME_VIOLET]: {
    background: styles.colors.white,
    foreground: styles.colors.violet,
  },
};

const ALTERNATE_FONT_FACE = styles.typography.familyAccessible;

const ColorSection = ({ scheme = DEFAULT_SCHEME, ...props }) => {
  const isAlternateColor = false;
  const isAlternateFontFace = false;

  return (
    <ColorSectionStyle
      isAlternateFontFace={isAlternateFontFace}
      isInverted={props.isInverted}
      scheme={isAlternateColor ? SCHEME_ALTERNATE : scheme}
    >
      {props.children}
    </ColorSectionStyle>
  );
};

export const ColorSectionStyle = styled.div`
  ${HeadingPrimaryStyle},
  ${HeadingSecondaryStyle},
  ${ParagraphStyle} {
    color: ${(props) => {
      const { foreground, background } = SCHEMES[props.scheme];
      return props.isInverted ? background : foreground;
    }};

    ${(props) => {
      return props.isAlternateFontFace
        ? `font-family: ${ALTERNATE_FONT_FACE}`
        : '';
    }};
  }
`;

ColorSection.propTypes = {
  children: PropTypes.node,
  isInverted: PropTypes.bool,
  scheme: PropTypes.oneOf(Object.keys(SCHEMES)),
};

export default ColorSection;
