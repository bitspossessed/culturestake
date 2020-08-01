import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import styles from '~/client/styles/variables';
import {
  ParagraphStyle,
  HeadingSecondaryStyle,
} from '~/client/styles/typography';

const BoxRounded = (props) => {
  return (
    <BoxRoundedStyle isDanger={props.isDanger}>
      <HeadingSecondaryStyle>{props.title}</HeadingSecondaryStyle>

      <BoxRoundedInnerStyle isDanger={props.isDanger}>
        {props.children}
      </BoxRoundedInnerStyle>
    </BoxRoundedStyle>
  );
};

export const BoxRoundedStyle = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;

  border: 1.5px solid;
  border-color: ${(props) =>
    props.isDanger ? `${styles.colors.red} !important` : styles.colors.violet};
  border-radius: 20px;

  color: ${(props) =>
    props.isDanger ? `${styles.colors.red} !important` : styles.colors.violet};

  ${HeadingSecondaryStyle} {
    color: ${(props) =>
      props.isDanger
        ? `${styles.colors.red} !important`
        : styles.colors.violet};
  }

  ${ParagraphStyle} {
    color: ${(props) =>
      props.isDanger
        ? `${styles.colors.red} !important`
        : styles.colors.violet};
  }
`;

export const BoxRoundedInnerStyle = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;

  border-color: ${(props) =>
    props.isDanger ? `${styles.colors.red} !important` : styles.colors.violet};
  border-top: 1.5px solid;
`;

BoxRounded.propTypes = {
  children: PropTypes.node.isRequired,
  isDanger: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

export default BoxRounded;
