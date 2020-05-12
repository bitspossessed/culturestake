import React from 'react';

import styles from '~/client/styles/variables';

export const ClipPathEllipsis = () => {
  return (
    <ellipse
      cx={CLIP_PATH_DIMENSION / 2}
      cy={CLIP_PATH_DIMENSION / 2}
      rx={CLIP_PATH_DIMENSION / 2}
      ry={CLIP_PATH_DIMENSION / 4}
    />
  );
};

export const ClipPathCorners = () => {
  return (
    <ellipse
      cx={CLIP_PATH_DIMENSION / 2}
      cy={CLIP_PATH_DIMENSION / 2}
      rx={CLIP_PATH_DIMENSION / 3.5}
      ry={CLIP_PATH_DIMENSION / 3}
    />
  );
};

export const ClipPathRectangle = () => {
  return (
    <rect
      height={CLIP_PATH_DIMENSION / 2}
      rx="10"
      width={CLIP_PATH_DIMENSION / 2}
      x={CLIP_PATH_DIMENSION / 4}
      y={CLIP_PATH_DIMENSION / 4}
    />
  );
};

export const CLIP_PATHS = {
  'clip-path-ellipsis': ClipPathEllipsis,
  'clip-path-corners': ClipPathCorners,
  'clip-path-rectangle': ClipPathRectangle,
};

export const CLIP_PATH_DIMENSION = 300;

const ClipPathDefinitions = () => {
  return (
    <svg
      height={CLIP_PATH_DIMENSION}
      style={{
        position: 'absolute',
        top: -CLIP_PATH_DIMENSION,
        left: -CLIP_PATH_DIMENSION,
      }}
      width={CLIP_PATH_DIMENSION}
    >
      <defs>
        {Object.keys(CLIP_PATHS).map((clipPathId) => {
          const ClipPathDefinition = CLIP_PATHS[clipPathId];

          return (
            <clipPath id={clipPathId} key={clipPathId}>
              <ClipPathDefinition />
            </clipPath>
          );
        })}

        {Object.keys(styles.schemes).map((schemeId) => {
          return (
            <filter id={`filter-${schemeId}`} key={schemeId}>
              <feFlood
                floodColor={styles.schemes[schemeId].foreground}
                result="fill"
              />

              <feBlend in="SourceGraphic" in2="fill" mode="lighten" />
            </filter>
          );
        })}
      </defs>
    </svg>
  );
};

export default ClipPathDefinitions;
