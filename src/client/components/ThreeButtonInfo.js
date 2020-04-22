import PropTypes from 'prop-types';
import React from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useLoader } from 'react-three-fiber';

import ThreeModel from '~/client/components/ThreeModel';
import close from '~/client/assets/images/close.svg';
import info from '~/client/assets/images/info.svg';
import {
  blueGradientTexture,
  redGradientTexture,
} from '~/client/styles/textures';

const ThreeButtonInfo = (props) => {
  const [closeSvg, infoSvg] = useLoader(SVGLoader, [close, info]);
  const svg = props.isExpanded ? closeSvg : infoSvg;
  const texture = props.isExpanded ? redGradientTexture : blueGradientTexture;

  // The info.svg is a little smoler than the others, lets rescale it!
  const scale = props.isExpanded ? 1 : 96 / 68.59;

  return (
    <ThreeModel
      {...props}
      scale={[scale, scale, scale]}
      svg={svg}
      texture={texture}
    />
  );
};

ThreeButtonInfo.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
};

export default ThreeButtonInfo;
