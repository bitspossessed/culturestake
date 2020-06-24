import PropTypes from 'prop-types';
import React from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useLoader } from 'react-three-fiber';

import ThreeModel from '~/client/components/ThreeModel';
import close from '~/client/assets/images/close.svg';
import info from '~/client/assets/images/info.svg';
import {
  alternateGradientTexture,
  blueGradientTexture,
  redGradientTexture,
} from '~/client/styles/textures';

const ThreeButtonInfo = (props) => {
  const [closeSvg, infoSvg] = useLoader(SVGLoader, [close, info]);
  const svg = props.isExpanded ? closeSvg : infoSvg;

  const texture = props.isExpanded
    ? redGradientTexture
    : props.isAlternateColor
    ? alternateGradientTexture
    : blueGradientTexture;

  return <ThreeModel {...props} svg={svg} texture={texture} />;
};

ThreeButtonInfo.propTypes = {
  isAlternateColor: PropTypes.bool,
  isExpanded: PropTypes.bool.isRequired,
};

export default ThreeButtonInfo;
