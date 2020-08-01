import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import styles from '~/client/styles/variables';

const Pill = (props) => {
  const { isAlternateColor } = useSelector((state) => state.app);

  return (
    <PillStyle isAlternateColor={isAlternateColor} isDanger={props.isDanger}>
      {props.children}
    </PillStyle>
  );
};

Pill.propTypes = {
  children: PropTypes.node.isRequired,
  isDanger: PropTypes.bool,
};

export const PillStyle = styled.span`
  display: inline-block;

  overflow: hidden;

  max-width: 100%;

  padding: 0.2rem;
  padding-right: 0.5rem;
  padding-left: 0.5rem;

  border: 1.5px solid
    ${(props) =>
      props.isDanger
        ? `${styles.colors.red} !important`
        : styles.colors.violet};
  border-radius: 15px;

  vertical-align: middle;

  white-space: nowrap;

  color: ${(props) =>
    props.isAlternateColor
      ? props.isDanger
        ? styles.colors.black
        : styles.colors.yellow
      : styles.colors.white};

  background-color: ${(props) =>
    props.isDanger ? `${styles.colors.red} !important` : styles.colors.violet};

  text-overflow: ellipsis;
`;

export default Pill;
