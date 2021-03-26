import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';

const UnderlineLink = (props) => {
  return (
    <UnderlineLinkStyle href={props.href} target="_blank">
      {props.children}
    </UnderlineLinkStyle>
  );
};

UnderlineLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export const UnderlineLinkStyle = styled.a`
  @media ${styles.media.tablet} {
    font-weight: ${styles.typography.weightMedium};
  }

  color: ${(props) =>
    props.isAlternateColor
      ? props.isDanger
        ? styles.colors.black
        : styles.colors.yellow
      : styles.colors.white};

  text-decoration: underline;
`;

export default UnderlineLink;
