import PropTypes from 'prop-types';
import React, { Suspense, useState } from 'react';
import styled from 'styled-components';
import { AmbientLight, Group, PointLight } from 'react-three-fiber/components';
import { Canvas, useThree } from 'react-three-fiber';

import ThreeButtonLogo from '~/client/components/ThreeButtonLogo';
import ThreeButtonNavigation from '~/client/components/ThreeButtonNavigation';

const ThreeInterface = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const onClickLogo = () => {
    // @TODO
  };

  const onClickNavigation = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <ThreeInterfaceStyle>
      <Canvas orthographic pixelRatio={window.devicePixelRatio}>
        <AmbientLight intensity={0.9} />

        <Suspense fallback={null}>
          <Group position={[0, 0, -500]}>
            <PointLight intensity={0.5} position={[0, 100, 100]} />

            <ThreeInterfaceElement left top>
              <ThreeButtonLogo onClick={onClickLogo} />
            </ThreeInterfaceElement>

            <ThreeInterfaceElement right top>
              <ThreeButtonNavigation
                isExpanded={isExpanded}
                onClick={onClickNavigation}
              />
            </ThreeInterfaceElement>
          </Group>
        </Suspense>
      </Canvas>
    </ThreeInterfaceStyle>
  );
};

const ThreeInterfaceElement = ({ offset = 50, ...props }) => {
  const { size } = useThree();

  // Move elements to the right corners of the screen
  const width = size.width / 2;
  const height = size.height / 2;

  const y = props.top ? height - offset : -height + offset;
  const x = props.right ? width - offset : -width + offset;

  // Show a pointer when hovering over the element
  const onPointerEnter = () => {
    document.body.style.cursor = 'pointer';
  };

  const onPointerLeave = () => {
    document.body.style.cursor = null;
  };

  return (
    <Group
      position={[x, y, 0]}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {props.children}
    </Group>
  );
};

ThreeInterfaceElement.propTypes = {
  bottom: PropTypes.bool,
  children: PropTypes.node.isRequired,
  left: PropTypes.bool,
  offset: PropTypes.number,
  right: PropTypes.bool,
  top: PropTypes.bool,
};

const ThreeInterfaceStyle = styled.div`
  position: fixed;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export default ThreeInterface;
