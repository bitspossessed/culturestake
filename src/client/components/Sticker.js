import PropTypes from 'prop-types';
import React, { Suspense, useMemo } from 'react';
import styled from 'styled-components';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useLoader } from 'react-three-fiber';
import { useSelector } from 'react-redux';

import rectangle from '~/client/assets/images/rectangle.svg';
import star from '~/client/assets/images/star.svg';
import styles, {
  DEFAULT_SCHEME,
  SCHEME_ALTERNATE,
} from '~/client/styles/variables';
import swirl from '~/client/assets/images/swirl.svg';
import { decodeSticker } from '~/common/services/sticker';
import {
  CLIP_PATHS,
  CLIP_PATH_DIMENSION,
} from '~/client/components/SVGDefinitions';

const PARTICLE_PATHS = {
  rectangle,
  star,
  swirl,
};

const Sticker = (props) => {
  // Extract Sticker properties from code
  const {
    scheme = DEFAULT_SCHEME,
    clipShapeId = 'clip-path-corners',
    particleShapeId = 'star',
    particlePositions = [],
  } = useMemo(() => {
    try {
      return decodeSticker(props.code);
    } catch {
      // Silently fail when code was wrong ..
      return {};
    }
  }, [props.code]);

  const { isAlternateColor } = useSelector((state) => state.app);
  const innerScheme = isAlternateColor ? SCHEME_ALTERNATE : scheme;

  return (
    <StickerStyle
      color={styles.schemes[innerScheme].foreground}
      height={CLIP_PATH_DIMENSION}
      width={CLIP_PATH_DIMENSION}
      xmlns="http://www.w3.org/2000/svg"
    >
      <StickerImage
        clipShapeId={clipShapeId}
        scheme={innerScheme}
        src={props.imagePath}
      />

      <Suspense fallback={null}>
        <StickerParticles
          path={PARTICLE_PATHS[particleShapeId]}
          positions={particlePositions}
          scheme={innerScheme}
        />
      </Suspense>

      {clipShapeId === 'clip-path-corners' ? (
        <g
          fill="transparent"
          shapeRendering="crispEdges"
          stroke={styles.schemes[innerScheme].foreground}
          strokeWidth="1.5"
        >
          <rect
            height={CLIP_PATH_DIMENSION / 1.5}
            width={CLIP_PATH_DIMENSION / 1.75}
            x={CLIP_PATH_DIMENSION / 4.7}
            y={CLIP_PATH_DIMENSION / 6}
          />
        </g>
      ) : null}
    </StickerStyle>
  );
};

const StickerImage = ({ offset = 30, ...props }) => {
  const StickerImageBorderShape = CLIP_PATHS[props.clipShapeId];

  return (
    <g
      clipPath={`url(#${props.clipShapeId})`}
      height={CLIP_PATH_DIMENSION}
      width={CLIP_PATH_DIMENSION}
    >
      {props.src && (
        <image
          filter={`url(#filter-${props.scheme})`}
          height={CLIP_PATH_DIMENSION + offset * 2}
          href={props.src}
          transform={`translate(-${offset}, -${offset})`}
          width={CLIP_PATH_DIMENSION + offset * 2}
        />
      )}

      <g
        fill="transparent"
        stroke={styles.schemes[props.scheme].foreground}
        strokeWidth="3"
      >
        <StickerImageBorderShape />
      </g>
    </g>
  );
};

const StickerParticles = (props) => {
  const { xml } = useLoader(SVGLoader, props.path);

  return props.positions.map(({ x, y }, index) => {
    // Make elements smaller
    xml.firstChild.setAttribute('transform', 'scale(0.7)');

    return (
      <g
        dangerouslySetInnerHTML={{ __html: xml.innerHTML }}
        key={index}
        transform={`translate(${x}, ${y})`}
      />
    );
  });
};

export const StickerStyle = styled.svg`
  display: block;

  width: ${CLIP_PATH_DIMENSION}px;

  margin: 0 auto;

  [fill] {
    fill: ${(props) => props.color};
  }

  [fill='transparent'] {
    fill: transparent;
  }

  [fill='none'] {
    fill: none;
  }

  [stroke] {
    stroke: ${(props) => props.color};
  }
`;

const particlePositions = PropTypes.arrayOf(
  PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
);

Sticker.propTypes = {
  code: PropTypes.string.isRequired,
  imagePath: PropTypes.string.isRequired,
};

StickerParticles.propTypes = {
  particlePath: PropTypes.string,
  particlePositions,
};

StickerImage.propTypes = {
  clipShapeId: PropTypes.string.isRequired,
  offset: PropTypes.number,
  scheme: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
};

export default Sticker;
