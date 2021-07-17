import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';
import {
  HeadingPrimaryStyle,
  HeadingSecondaryStyle,
} from '~/client/styles/typography';

const Box = ({ children, ...props }) => {
  return <BoxStyle {...props}>{children}</BoxStyle>;
};

const BoxStyle = styled.div`
  position: relative;

  display: flex;

  min-height: 14rem;

  padding: 2rem;

  text-align: center;

  align-items: center;
  justify-content: center;

  ${/* sc-selector */ HeadingPrimaryStyle} {
    @media ${styles.media.tablet} {
      font-size: 4em;
    }

    margin: 0;
  }

  ${/* sc-selector */ HeadingSecondaryStyle} {
    @media ${styles.media.tablet} {
      font-size: 2em;
    }

    margin: 0;
  }
`;

Box.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Box;
