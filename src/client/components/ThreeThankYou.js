import PropTypes from 'prop-types';
import React from 'react';

import ThreeModel from '~/client/components/ThreeModel';
import { alternateMaterial, limeMaterial } from '~/client/styles/materials';
import { useExtrudeGeometry } from '~/client/hooks/geometry';

const ThreeThankYou = (props) => {
  const material = props.isAlternateColor ? alternateMaterial : limeMaterial;
  const geometry = useExtrudeGeometry('thankyou', 50);

  return (
    <ThreeModel
      {...props}
      geometry={geometry}
      material={material}
      rotation={[-Math.PI - 0.12, -0.5, 0.2]}
    />
  );
};

ThreeThankYou.propTypes = {
  isAlternateColor: PropTypes.bool,
};

export default ThreeThankYou;
