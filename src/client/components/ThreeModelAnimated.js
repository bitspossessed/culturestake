import PropTypes from 'prop-types';
import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Group, BoxBufferGeometry, Mesh } from 'react-three-fiber/components';
import { Vector3 } from 'three';
import { useFrame } from 'react-three-fiber';

import ThreeModel from '~/client/components/ThreeModel';
import ThreeSpinner from '~/client/components/ThreeSpinner';
import { randomFromArray } from '~/common/utils/random';

const eulerVector = new Vector3(Math.PI * 2, Math.PI * 2, Math.PI * 2);

const possibleRotations = [
  new Vector3(1, 0, 0),
  new Vector3(0, 1, 0),
  new Vector3(0, 0, 1),
];

const ThreeModelAnimated = (props) => {
  const model = useRef();

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
    if (!model.current) {
      return;
    }

    const { rotation } = model.current;
    rotation.setFromVector3(rotation.toVector3().lerp(targetRotation, delta));
  });

  useEffect(() => {
    const initialRotation = new Vector3().fromArray(props.rotation);

    setOriginalRotation(initialRotation);
    setTargetRotation(initialRotation);
  }, [props.rotation]);

  return (
    <Suspense fallback={<ThreeSpinner />}>
      <Group
        {...props}
        ref={model}
        onClick={props.onClick}
        onPointerEnter={onPointerEnter}
      >
        <Mesh visible={false}>
          <BoxBufferGeometry args={[15, 15, 15]} attach="geometry" />
        </Mesh>

        <ThreeModel url={props.url} />
      </Group>
    </Suspense>
  );
};

ThreeModelAnimated.propTypes = {
  onClick: PropTypes.func.isRequired,
  rotation: PropTypes.array.isRequired,
  url: PropTypes.string.isRequired,
};

export default ThreeModelAnimated;
