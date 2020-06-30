import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useLoader } from 'react-three-fiber';
import { useSelector } from 'react-redux';

import {
  CLIP_PATHS,
  CLIP_PATH_DIMENSION,
} from '~/client/components/SVGDefinitions';
import styles, {
  DEFAULT_SCHEME,
  SCHEME_ALTERNATE,
} from '~/client/styles/variables';
import star from '~/client/assets/images/star.svg';

// @TODO: Extract properties from sticker generator codes
const Sticker = ({
  clipPathId = Object.keys(CLIP_PATHS)[0],
  particlePositions = [],
  particlePath = star,
  scheme = DEFAULT_SCHEME,
  ...props
}) => {
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
        clipPathId={clipPathId}
        scheme={innerScheme}
        src={props.src}
      />

      <Suspense fallback={null}>
        <StickerParticles
          path={particlePath}
          positions={particlePositions}
          scheme={innerScheme}
        />
      </Suspense>

      {clipPathId === 'clip-path-corners' ? (
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
  const StickerImageBorderShape = CLIP_PATHS[props.clipPathId];

  return (
    <g
      clipPath={`url(#${props.clipPathId})`}
      height={CLIP_PATH_DIMENSION}
      width={CLIP_PATH_DIMENSION}
    >
      <image
        filter={`url(#filter-${props.scheme})`}
        height={CLIP_PATH_DIMENSION + offset * 2}
        href={props.src}
        transform={`translate(-${offset}, -${offset})`}
        width={CLIP_PATH_DIMENSION + offset * 2}
      />

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

// @TODO: Move this later to a Sticker Generator component
// const StickerParticles = ({ offset = 30, ...props }) => {
//   const { xml } = useLoader(SVGLoader, props.path);

//   return new Array(props.count).fill(0).map((item, index) => {
//     const side = randomFromArray(['top', 'right', 'bottom', 'left']);

//     let x = randomRange(offset, offset * 2);
//     let y = randomRange(offset, offset * 2);

//     if (side === 'top') {
//       x = randomRange(offset, CLIP_PATH_DIMENSION - offset);
//     } else if (side === 'right') {
//       x = randomRange(
//         CLIP_PATH_DIMENSION - offset * 2,
//         CLIP_PATH_DIMENSION - offset,
//       );
//       y = randomRange(offset, CLIP_PATH_DIMENSION - offset);
//     } else if (side === 'bottom') {
//       x = randomRange(offset, CLIP_PATH_DIMENSION - offset);
//       y = randomRange(
//         CLIP_PATH_DIMENSION - offset * 2,
//         CLIP_PATH_DIMENSION - offset,
//       );
//     } else if (side === 'left') {
//       y = randomRange(offset, CLIP_PATH_DIMENSION - offset);
//     }

//     // Make elements smaller
//     xml.firstChild.setAttribute('transform', 'scale(0.7)');

//     return (
//       <g
//         dangerouslySetInnerHTML={{ __html: xml.innerHTML }}
//         key={index}
//         transform={`translate(${x}, ${y})`}
//       />
//     );
//   });
// };

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
  clipPathId: PropTypes.string,
  particlePath: PropTypes.string,
  particlePositions,
  scheme: PropTypes.string,
  src: PropTypes.string.isRequired,
};

StickerParticles.propTypes = {
  particlePath: PropTypes.string,
  particlePositions,
};

StickerImage.propTypes = {
  clipPathId: PropTypes.string.isRequired,
  offset: PropTypes.number,
  scheme: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
};

export default Sticker;
