import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import styles from '~/client/styles/variables';

const Pill = (props) => {
  const { isAlternateColor } = useSelector((state) => state.app);

  return (
    <PillStyle isAlternateColor={isAlternateColor}>{props.children}</PillStyle>
  );
};

Pill.propTypes = {
  children: PropTypes.node.isRequired,
};

export const PillStyle = styled.span`
  padding: 0.2rem;
  padding-right: 0.5rem;
  padding-left: 0.5rem;

  border: 1.5px solid ${styles.colors.violet};
  border-radius: 15px;

  color: ${(props) =>
    props.isAlternateColor ? styles.colors.yellow : styles.colors.white};

  background-color: ${styles.colors.violet};
`;

export default Pill;
