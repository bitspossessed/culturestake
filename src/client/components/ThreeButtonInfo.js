import PropTypes from 'prop-types';
import React from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useLoader } from 'react-three-fiber';

import ThreeModelAnimated from '~/client/components/ThreeModelAnimated';
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
  const scale = props.isExpanded ? 1 : 96 / 68.59;

  return (
    <ThreeModelAnimated
      {...props}
      rotation={[3, -0.5, -0.1]}
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
