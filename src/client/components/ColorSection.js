import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import styles, {
  DEFAULT_SCHEME,
  SCHEME_ALTERNATE,
} from '~/client/styles/variables';
import {
  HeadingPrimaryStyle,
  HeadingSecondaryStyle,
  ParagraphStyle,
} from '~/client/styles/typography';
import { BackgroundAreaStyle } from '~/client/styles/layout';

const ColorSection = ({ scheme = DEFAULT_SCHEME, ...props }) => {
  const { isAlternateColor, isAlternateFontFace, isLargerFont } = useSelector(
    (state) => state.app,
  );

  return (
    <ColorSectionStyle
      isAlternateColor={isAlternateColor}
      isAlternateFontFace={isAlternateFontFace}
      isInverted={props.isInverted}
      isLargerFont={isLargerFont}
      scheme={isAlternateColor ? SCHEME_ALTERNATE : scheme}
    >
      {props.children}
    </ColorSectionStyle>
  );
};

export const ColorSectionStyle = styled.div`
  ${/* sc-selector */ ParagraphStyle},
  ${/* sc-selector */ HeadingPrimaryStyle},
  ${/* sc-selector */ HeadingSecondaryStyle} {
    color: ${(props) => {
      const { foreground, background } = styles.schemes[props.scheme];
      return props.isInverted ? background : foreground;
    }};

    font-family: ${(props) => {
      return props.isAlternateFontFace
        ? styles.typography.familyAccessible
        : null;
    }};
  }

  ${/* sc-selector */ ParagraphStyle} {
    font-size: ${(props) => {
      return props.isLargerFont ? '1.5em' : null;
    }};
  }

  ${/* sc-selector */ HeadingPrimaryStyle} {
    font-size: ${(props) => {
      return props.isLargerFont ? '6em' : null;
    }};
  }

  ${/* sc-selector */ HeadingSecondaryStyle} {
    font-size: ${(props) => {
      return props.isLargerFont ? '2.5em' : null;
    }};
  }

  ${/* sc-selector */ BackgroundAreaStyle} {
    background-color: ${(props) => {
      const { foreground, background } = styles.schemes[props.scheme];
      return props.isInverted ? foreground : background;
    }};
  }
`;

ColorSection.propTypes = {
  children: PropTypes.node,
  isInverted: PropTypes.bool,
  scheme: PropTypes.oneOf(Object.keys(styles.schemes)),
};

export default ColorSection;
