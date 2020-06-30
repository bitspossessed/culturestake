import PropTypes from 'prop-types';
import React from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useLoader } from 'react-three-fiber';

import ThreeModel from '~/client/components/ThreeModel';
import logo from '~/client/assets/images/logo.svg';
import {
  alternateGradientTexture,
  limeGradientTexture,
} from '~/client/styles/textures';

const ThreeButtonLogo = (props) => {
  const svg = useLoader(SVGLoader, logo);

  const texture = props.isAlternateColor
    ? alternateGradientTexture
    : limeGradientTexture;

  return <ThreeModel {...props} svg={svg} texture={texture} />;
};

ThreeButtonLogo.propTypes = {
  isAlternateColor: PropTypes.bool,
};

export default ThreeButtonLogo;
