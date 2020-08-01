import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { BoxGeometry, Group, Mesh } from 'react-three-fiber/components';
import { Vector3 } from 'three';
import { useUpdate } from 'react-three-fiber';

const DEFAULT_SCALE = 0.5;

const ThreeModel = ({ geometry, material, rotation, scale, ...props }) => {
  const [boxSize, setBoxSize] = useState([0, 0, 0]);

  const ref = useUpdate((self) => {
    const size = new Vector3();

    self.geometry.computeBoundingBox();
    self.geometry.boundingBox.getSize(size);

    // Center object to origin
    self.position.x = -size.x / 2;
    self.position.y = -size.y / 2;
    self.position.z = -size.z / 2;

    // Box around object to handle clicks
    const maxSize = Math.max(size.x, size.y, size.z);
    setBoxSize([maxSize, maxSize, maxSize]);
  }, []);

  return (
    <Group
      rotation={rotation}
      scale={scale || [DEFAULT_SCALE, DEFAULT_SCALE, DEFAULT_SCALE]}
    >
      <Mesh {...props} geometry={geometry} material={material} ref={ref} />

      <Mesh visible={false}>
        <BoxGeometry args={boxSize} attach="geometry" />
      </Mesh>
    </Group>
  );
};

ThreeModel.propTypes = {
  geometry: PropTypes.object.isRequired,
  material: PropTypes.object.isRequired,
  rotation: PropTypes.arrayOf(PropTypes.number),
  scale: PropTypes.arrayOf(PropTypes.number),
};

export default ThreeModel;
