import PropTypes from 'prop-types';
import React from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useLoader } from 'react-three-fiber';

import ThreeModel from '~/client/components/ThreeModel';
import close from '~/client/assets/images/close.svg';
import menu from '~/client/assets/images/menu.svg';
import {
  alternateGradientTexture,
  limeGradientTexture,
} from '~/client/styles/textures';

const ThreeButtonNavigation = (props) => {
  const [closeSvg, menuSvg] = useLoader(SVGLoader, [close, menu]);
  const svg = props.isExpanded ? closeSvg : menuSvg;

  const texture = props.isAlternateColor
    ? alternateGradientTexture
    : limeGradientTexture;

  return <ThreeModel {...props} svg={svg} texture={texture} />;
};

ThreeButtonNavigation.propTypes = {
  isAlternateColor: PropTypes.bool,
  isExpanded: PropTypes.bool.isRequired,
};

export default ThreeButtonNavigation;
