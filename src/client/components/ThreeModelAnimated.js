import PropTypes from 'prop-types';
import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Group, BoxGeometry, Mesh } from 'react-three-fiber/components';
import { Vector3 } from 'three';
import { useFrame } from 'react-three-fiber';

import ThreeModel from '~/client/components/ThreeModel';
import ThreeSpinner from '~/client/components/ThreeSpinner';
import { randomRange, randomFromArray } from '~/common/utils/random';

const RANDOM_ANIMATION_MIN = 8000;
const RANDOM_ANIMATION_MAX = 25000;

const eulerVector = new Vector3(Math.PI * 2, Math.PI * 2, Math.PI * 2);

const possibleRotations = [
  new Vector3(1, 0, 0),
  new Vector3(0, 1, 0),
  new Vector3(0, 0, 1),
];

const ThreeModelAnimated = ({ onClick, ...props }) => {
  let timeout;

  const model = useRef();

  const [originalRotation, setOriginalRotation] = useState(new Vector3());
  const [targetRotation, setTargetRotation] = useState(new Vector3());
  const [isHovered, setIsHovered] = useState(false);

  // Use references to keep state inside of setTimeout
  // https://github.com/facebook/react/issues/14010
  const originalRotationRef = useRef(originalRotation);
  originalRotationRef.current = originalRotation;

  const targetRotationRef = useRef(targetRotation);
  targetRotationRef.current = targetRotation;

  const isHoveredRef = useRef(isHovered);
  isHoveredRef.current = isHovered;

  const animate = () => {
    const target = eulerVector
      .clone()
      .multiply(randomFromArray(possibleRotations));

    setTargetRotation(originalRotationRef.current.add(target));
  };

  const onPointerEnter = () => {
    setIsHovered(true);
    animate();
  };

  const onPointerLeave = () => {
    setIsHovered(false);
  };

  const nextRandomAnimation = () => {
    clearRandomAnimation();

    timeout = window.setTimeout(() => {
      if (!isHoveredRef.current) {
        animate();
      }

      nextRandomAnimation();
    }, randomRange(RANDOM_ANIMATION_MIN, RANDOM_ANIMATION_MAX));
  };

  const clearRandomAnimation = () => {
    window.clearTimeout(timeout);
  };

  useFrame((state, delta) => {
    if (!model.current) {
      return;
    }

    const { rotation } = model.current;

    rotation.setFromVector3(
      rotation.toVector3().lerp(targetRotationRef.current, delta),
    );
  });

  useEffect(() => {
    const initialRotation = new Vector3().fromArray(props.rotation);

    setOriginalRotation(initialRotation);
    setTargetRotation(initialRotation);

    nextRandomAnimation();

    return () => {
      clearRandomAnimation();
    };
  }, [props.rotation]);

  return (
    <Suspense fallback={<ThreeSpinner />}>
      <Group
        {...props}
        ref={model}
        onClick={onClick}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <Mesh visible={false}>
          <BoxGeometry args={[10, 10, 10]} attach="geometry" />
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
