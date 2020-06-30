import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';
import paper from '~/client/assets/images/paper.png';

const Paper = (props) => {
  return <PaperStyle scheme={props.scheme}>{props.children}</PaperStyle>;
};

export const PaperStyle = styled.div`
  position: relative;

  background-color: ${(props) => {
    if (props.scheme) {
      return styles.schemes[props.scheme].backgroundSticker;
    }

    return styles.colors.white;
  }};

  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);

  &::after {
    position: absolute;

    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    z-index: ${styles.layers.Paper};

    display: block;

    content: '';

    background-image: url(${paper});
    background-size: 75px;

    mix-blend-mode: multiply;

    user-select: none;

    pointer-events: none;
  }
`;

Paper.propTypes = {
  children: PropTypes.node,
  scheme: PropTypes.string,
};

export default Paper;
