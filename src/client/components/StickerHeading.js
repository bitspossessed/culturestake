import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import styles, { SCHEME_ALTERNATE } from '~/client/styles/variables';

const StickerHeading = (props) => {
  const { isAlternateColor, isAlternateFontFace } = useSelector(
    (state) => state.app,
  );

  const scheme = isAlternateColor ? SCHEME_ALTERNATE : props.scheme;

  return (
    <StickerHeadingStyle>
      {props.title && (
        <StickerHeadingTitleStyle
          isAlternateFontFace={isAlternateFontFace}
          scheme={scheme}
        >
          {props.title}
        </StickerHeadingTitleStyle>
      )}

      {props.subtitle && (
        <StickerHeadingSubtitleStyle
          isAlternateFontFace={isAlternateFontFace}
          scheme={scheme}
        >
          {props.subtitle}
        </StickerHeadingSubtitleStyle>
      )}
    </StickerHeadingStyle>
  );
};

export const StickerHeadingStyle = styled.div`
  position: relative;

  top: -2rem;
`;

export const StickerHeadingTitleStyle = styled.h3`
  color: ${(props) => styles.schemes[props.scheme].foreground};

  font-size: 3em;
  font-family: ${(props) => {
    return props.isAlternateFontFace
      ? styles.typography.familyAccessible
      : null;
  }};

  line-height: 0.9;

  text-align: center;
`;

export const StickerHeadingSubtitleStyle = styled.p`
  margin-top: 1rem;

  color: ${(props) => styles.schemes[props.scheme].foreground};

  font-family: ${(props) => {
    return props.isAlternateFontFace
      ? styles.typography.familyAccessible
      : null;
  }};

  text-align: center;
  text-transform: uppercase;
`;

StickerHeading.propTypes = {
  scheme: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

export default StickerHeading;
