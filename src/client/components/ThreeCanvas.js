import PropTypes from 'prop-types';
import React from 'react';
import { AmbientLight, PointLight, Group } from 'react-three-fiber/components';
import { Canvas } from 'react-three-fiber';

const ThreeCanvas = ({ children, ...props }) => {
  return (
    <Canvas
      {...props}
      orthographic
      pixelRatio={window.devicePixelRatio}
      shadowMap={false}
    >
      <AmbientLight intensity={0.8} />
      <PointLight intensity={0.4} position={[0, 0, 100]} />
      <Group position={[0, 0, -500]}>{children}</Group>
    </Canvas>
  );
};

ThreeCanvas.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThreeCanvas;
