import PropTypes from 'prop-types';
import React from 'react';

import ThreeModel from '~/client/components/ThreeModel';
import {
  alternateMaterial,
  blueMaterial,
  redMaterial,
} from '~/client/styles/materials';
import { useExtrudeGeometry } from '~/client/hooks/geometry';

const ThreeButtonInfo = (props) => {
  const geometry = useExtrudeGeometry(props.isExpanded ? 'close' : 'info');

  const material = props.isExpanded
    ? redMaterial
    : props.isAlternateColor
    ? alternateMaterial
    : blueMaterial;

  return <ThreeModel {...props} geometry={geometry} material={material} />;
};

ThreeButtonInfo.propTypes = {
  isAlternateColor: PropTypes.bool,
  isExpanded: PropTypes.bool.isRequired,
};

export default ThreeButtonInfo;
