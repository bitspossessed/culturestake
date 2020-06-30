import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';

const Pill = (props) => {
  return <PillStyle>{props.children}</PillStyle>;
};

Pill.propTypes = {
  children: PropTypes.node.isRequired,
};

const PillStyle = styled.span`
  padding: 0.2rem;
  padding-right: 0.5rem;
  padding-left: 0.5rem;

  border: 1.5px solid ${styles.colors.violet};
  border-radius: 15px;

  color: ${styles.colors.white};

  background-color: ${styles.colors.violet};
`;

export default Pill;
