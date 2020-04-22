import React from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useLoader } from 'react-three-fiber';

import ThreeModel from '~/client/components/ThreeModel';
import logo from '~/client/assets/images/logo.svg';
import { limeGradientTexture } from '~/client/styles/textures';

const ThreeButtonLogo = (props) => {
  const svg = useLoader(SVGLoader, logo);
  return <ThreeModel {...props} svg={svg} texture={limeGradientTexture} />;
};

export default ThreeButtonLogo;
