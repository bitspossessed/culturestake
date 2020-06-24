import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const View = (props) => {
  return <ViewStyle>{props.children}</ViewStyle>;
};

View.propTypes = {
  children: PropTypes.node.isRequired,
};

export const ViewStyle = styled.main`
  height: 100%;
`;

export default View;
