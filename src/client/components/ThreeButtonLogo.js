import React from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useLoader } from 'react-three-fiber';

import ThreeModelAnimated from '~/client/components/ThreeModelAnimated';
import logo from '~/client/assets/images/logo.svg';
import { limeGradientTexture } from '~/client/styles/textures';

const ThreeButtonLogo = (props) => {
  const svg = useLoader(SVGLoader, logo);

  return (
    <ThreeModelAnimated
      {...props}
      rotation={[3.5, -0.6, 0]}
      svg={svg}
      texture={limeGradientTexture}
    />
  );
};

export default ThreeButtonLogo;
