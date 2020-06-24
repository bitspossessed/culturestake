import PropTypes from 'prop-types';
import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Group } from 'react-three-fiber/components';
import { Vector3 } from 'three';
import { useFrame } from 'react-three-fiber';

import { randomFromArray } from '~/common/utils/random';

const eulerVector = new Vector3(Math.PI * 2, Math.PI * 2, Math.PI * 2);

const possibleRotations = [
  new Vector3(1, 0, 0),
  new Vector3(0, 1, 0),
  new Vector3(0, 0, 1),
];

const ThreeRotator = ({ children, ...props }) => {
  const ref = useRef();

  const [originalRotation, setOriginalRotation] = useState(new Vector3());
  const [targetRotation, setTargetRotation] = useState(new Vector3());

  const animate = () => {
    const target = eulerVector
      .clone()
      .multiply(randomFromArray(possibleRotations));

    setTargetRotation(originalRotation.add(target));
  };

  const onPointerEnter = () => {
    animate();
  };

  useFrame((state, delta) => {
    if (!ref.current) {
      return;
    }

    const { rotation } = ref.current;
    rotation.setFromVector3(rotation.toVector3().lerp(targetRotation, delta));
  });

  useEffect(() => {
    const initialRotation = new Vector3().fromArray(props.rotation);

    setOriginalRotation(initialRotation);
    setTargetRotation(initialRotation);
  }, [props.rotation]);

  return (
    <Suspense fallback={null}>
      <Group {...props} ref={ref} onPointerEnter={onPointerEnter}>
        {children}
      </Group>
    </Suspense>
  );
};

ThreeRotator.propTypes = {
  children: PropTypes.node.isRequired,
  rotation: PropTypes.array.isRequired,
};

export default ThreeRotator;
