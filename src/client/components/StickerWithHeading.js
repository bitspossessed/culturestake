import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import PaperTicket from '~/client/components/PaperTicket';
import Sticker from '~/client/components/Sticker';
import styles, { SCHEME_ALTERNATE } from '~/client/styles/variables';
import { useSticker } from '~/client/hooks/sticker';

const StickerWithHeading = ({ code, imagePath, title, subtitle }) => {
  const { isAlternateColor, isAlternateFontFace } = useSelector(
    (state) => state.app,
  );

  const sticker = useSticker(code);
  const scheme = isAlternateColor ? SCHEME_ALTERNATE : sticker.scheme;

  return (
    <Suspense fallback={null}>
      <PaperTicket scheme={scheme}>
        <Sticker code={code} imagePath={imagePath} />

        <StickerWithHeadingStyle>
          <StickerWithHeadingTitleStyle
            isAlternateFontFace={isAlternateFontFace}
            scheme={scheme}
          >
            {title}
          </StickerWithHeadingTitleStyle>

          <StickerWithHeadingSubtitleStyle
            isAlternateFontFace={isAlternateFontFace}
            scheme={scheme}
          >
            {subtitle}
          </StickerWithHeadingSubtitleStyle>
        </StickerWithHeadingStyle>
      </PaperTicket>
    </Suspense>
  );
};

export const StickerWithHeadingStyle = styled.div`
  position: relative;

  top: -2rem;
`;

export const StickerWithHeadingTitleStyle = styled.h3`
  margin-bottom: 1rem;

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

export const StickerWithHeadingSubtitleStyle = styled.p`
  color: ${(props) => styles.schemes[props.scheme].foreground};

  font-family: ${(props) => {
    return props.isAlternateFontFace
      ? styles.typography.familyAccessible
      : null;
  }};

  text-align: center;
  text-transform: uppercase;
`;

StickerWithHeading.propTypes = {
  code: PropTypes.string,
  imagePath: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

export default StickerWithHeading;
