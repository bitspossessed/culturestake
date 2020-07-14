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
