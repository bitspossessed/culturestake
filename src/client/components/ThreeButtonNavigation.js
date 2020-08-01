import PropTypes from 'prop-types';
import React from 'react';

import ThreeModel from '~/client/components/ThreeModel';
import { alternateMaterial, limeMaterial } from '~/client/styles/materials';
import { useExtrudeGeometry } from '~/client/hooks/geometry';

const ThreeButtonNavigation = (props) => {
  const material = props.isAlternateColor ? alternateMaterial : limeMaterial;
  const geometry = useExtrudeGeometry(props.isExpanded ? 'close' : 'menu');
  return <ThreeModel {...props} geometry={geometry} material={material} />;
};

ThreeButtonNavigation.propTypes = {
  isAlternateColor: PropTypes.bool,
  isExpanded: PropTypes.bool.isRequired,
};

export default ThreeButtonNavigation;
