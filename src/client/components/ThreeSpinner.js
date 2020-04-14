import React, { useRef } from 'react';
import {
  BoxBufferGeometry,
  Mesh,
  MeshStandardMaterial,
} from 'react-three-fiber/components';

const ThreeSpinner = (props) => {
  const mesh = useRef();

  return (
    <Mesh {...props} ref={mesh}>
      <BoxBufferGeometry args={[1, 1, 1]} attach="geometry" />
      <MeshStandardMaterial attach="material" color="hotpink" />
    </Mesh>
  );
};

export default ThreeSpinner;
