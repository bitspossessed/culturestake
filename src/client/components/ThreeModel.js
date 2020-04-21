import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { Vector3 } from 'three';
import {
  BoxGeometry,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
} from 'react-three-fiber/components';
import { useUpdate } from 'react-three-fiber';

const SCALE = 0.5;
const EXTRUDE_DEPTH = 20;

const ThreeModel = ({ svg, texture, ...props }) => {
  const [boxSize, setBoxSize] = useState([0, 0, 0]);

  const shapes = useMemo(() => {
    return svg.paths.flatMap((path) => {
      return path.toShapes(false, false);
    });
  }, [svg]);

  const options = {
    bevelEnabled: false,
    curveSegments: 36,
    depth: EXTRUDE_DEPTH,
  };

  const ref = useUpdate(
    (self) => {
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
    },
    [shapes],
  );

  return (
    <Group scale={[SCALE, SCALE, SCALE]}>
      <Mesh {...props} ref={ref}>
        <ExtrudeGeometry args={[shapes, options]} attach="geometry" />

        <MeshStandardMaterial
          attach="material"
          map={texture}
          metalness={0.1}
          roughness={0}
        />
      </Mesh>

      <Mesh visible={false}>
        <BoxGeometry args={boxSize} attach="geometry" />
      </Mesh>
    </Group>
  );
};

ThreeModel.propTypes = {
  svg: PropTypes.object.isRequired,
  texture: PropTypes.object.isRequired,
};

export default ThreeModel;
