import React from 'react';
import styled from 'styled-components';
import { AmbientLight, PointLight, Group } from 'react-three-fiber/components';
import { Canvas } from 'react-three-fiber';

import ThreeLogo from '~/client/components/ThreeLogo';

const ThreeInterface = () => {
  const onClickLogo = () => {
    // @TODO
  };

  return (
    <ThreeInterfaceStyle>
      <Canvas
        camera={{ zoom: 1, near: 0.1, far: 2000 }}
        orthographic
        pixelRatio={window.devicePixelRatio}
      >
        <AmbientLight />

        <Group position={[0, 0, -500]}>
          <PointLight intensity={2} position={[0, 0, 20]} />

          <ThreeLogo
            position={[0, 0, 0]}
            scale={[5, 5, 5]}
            onClick={onClickLogo}
          />
        </Group>
      </Canvas>
    </ThreeInterfaceStyle>
  );
};

const ThreeInterfaceStyle = styled.div`
  position: fixed;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export default ThreeInterface;
