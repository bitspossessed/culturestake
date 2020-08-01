import PropTypes from 'prop-types';
import React from 'react';

import ThreeModel from '~/client/components/ThreeModel';
import { alternateMaterial, limeMaterial } from '~/client/styles/materials';
import { useExtrudeGeometry } from '~/client/hooks/geometry';

const ThreeButtonLogo = (props) => {
  const material = props.isAlternateColor ? alternateMaterial : limeMaterial;
  const geometry = useExtrudeGeometry('logo');
  return <ThreeModel {...props} geometry={geometry} material={material} />;
};

ThreeButtonLogo.propTypes = {
  isAlternateColor: PropTypes.bool,
};

export default ThreeButtonLogo;
