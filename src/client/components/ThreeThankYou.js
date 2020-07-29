import PropTypes from 'prop-types';
import React from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useLoader } from 'react-three-fiber';

import ThreeModel from '~/client/components/ThreeModel';
import ThreeRotator from '~/client/components/ThreeRotator';
import thankYou from '~/client/assets/images/thankyou.svg';
import {
  alternateGradientTexture,
  limeGradientTexture,
} from '~/client/styles/textures';

const ThreeThankYou = (props) => {
  const svg = useLoader(SVGLoader, thankYou);
  const texture = props.isAlternateColor
    ? alternateGradientTexture
    : limeGradientTexture;

  return (
    <ThreeRotator rotation={[0, 0, 0]}>
      <ThreeModel
        {...props}
        depth={50}
        rotation={[-Math.PI - 0.12, -0.5, 0.2]}
        svg={svg}
        texture={texture}
      />
    </ThreeRotator>
  );
};

ThreeThankYou.propTypes = {
  isAlternateColor: PropTypes.bool,
};

export default ThreeThankYou;
