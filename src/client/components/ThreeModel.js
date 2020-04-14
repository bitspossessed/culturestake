import PropTypes from 'prop-types';
import React from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Primitive } from 'react-three-fiber/components';
import { useLoader } from 'react-three-fiber';

// eslint-disable-next-line react/display-name
const ThreeModel = React.forwardRef(({ url, ...props }, ref) => {
  const gltf = useLoader(GLTFLoader, url);
  return <Primitive {...props} dispose={null} object={gltf.scene} ref={ref} />;
});

ThreeModel.propTypes = {
  url: PropTypes.string.isRequired,
};

export default ThreeModel;
