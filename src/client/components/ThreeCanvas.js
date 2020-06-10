import PropTypes from 'prop-types';
import React from 'react';
import { AmbientLight, PointLight, Group } from 'react-three-fiber/components';
import { Canvas } from 'react-three-fiber';

const ThreeCanvas = ({ children, isDimmed, ...props }) => {
  return (
    <Canvas
      {...props}
      orthographic
      pixelRatio={window.devicePixelRatio}
      shadowMap={false}
    >
      <AmbientLight intensity={isDimmed ? 0.5 : 0.8} />
      <PointLight intensity={isDimmed ? 0.1 : 0.4} position={[0, 0, 100]} />
      <Group position={[0, 0, -500]}>{children}</Group>
    </Canvas>
  );
};

ThreeCanvas.propTypes = {
  children: PropTypes.node.isRequired,
  isDimmed: PropTypes.bool,
};

export default ThreeCanvas;