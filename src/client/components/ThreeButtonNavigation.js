import PropTypes from 'prop-types';
import React from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useLoader } from 'react-three-fiber';

import ThreeModelAnimated from '~/client/components/ThreeModelAnimated';
import close from '~/client/assets/images/close.svg';
import menu from '~/client/assets/images/menu.svg';
import { limeGradientTexture } from '~/client/styles/textures';

const ThreeButtonNavigation = (props) => {
  const [closeSvg, menuSvg] = useLoader(SVGLoader, [close, menu]);
  const svg = props.isExpanded ? closeSvg : menuSvg;

  return (
    <ThreeModelAnimated
      {...props}
      rotation={[3.5, 0.3, 0]}
      svg={svg}
      texture={limeGradientTexture}
    />
  );
};

ThreeButtonNavigation.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
};

export default ThreeButtonNavigation;
