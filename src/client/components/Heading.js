import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';

const Heading = (props) => {
  return <HeadingStyle>{props.children}</HeadingStyle>;
};

export const HeadingStyle = styled.p`
  margin: ${styles.layout.spacing};
`;

Heading.propTypes = {
  children: PropTypes.node,
};

export default Heading;
