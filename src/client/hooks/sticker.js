import { useMemo } from 'react';

import { DEFAULT_SCHEME } from '~/client/styles/variables';
import { decodeSticker } from '~/common/services/sticker';

export const useSticker = (code) => {
  // Extract Sticker properties from code
  const {
    scheme = DEFAULT_SCHEME,
    clipShapeId = 'clip-path-corners',
    particleShapeId = 'star',
    particlePositions = [],
  } = useMemo(() => {
    try {
      return decodeSticker(code);
    } catch {
      // Silently fail when code was wrong ..
      return {};
    }
  }, [code]);

  return {
    clipShapeId,
    particlePositions,
    particleShapeId,
    scheme,
  };
};

export const useStickerImage = (images) => {
  if (
    images &&
    Array.isArray(images) &&
    images.length > 0 &&
    'urlThresholdThumb' in images[0]
  ) {
    return images[0].urlThresholdThumb;
  }

  if (typeof images === 'string') {
    return images;
  }

  return null;
};
