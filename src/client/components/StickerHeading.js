import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';
import { useScheme } from '~/client/hooks/scheme';

const StickerHeading = (props) => {
  const { isAlternateFontFace, scheme } = useScheme(props.scheme);

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

  padding-top: 1rem;
  padding-right: 4rem;
  padding-bottom: 1rem;
  padding-left: 4rem;
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
