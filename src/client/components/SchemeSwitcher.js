import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';

const SchemeSwitcher = () => {
  return (
    <Fragment>
      <SchemeSwitcherStyle>
        <SchemeSwitcherItem />
        <SchemeSwitcherItem isSmall />
        <SchemeSwitcherItem isAlternateFontFace />
        <SchemeSwitcherItem isAlternateFontFace isSmall />
      </SchemeSwitcherStyle>

      <SchemeSwitcherStyle>
        <SchemeSwitcherItem isAlternateColor />
        <SchemeSwitcherItem isAlternateColor isSmall />
        <SchemeSwitcherItem isAlternateColor isAlternateFontFace />
        <SchemeSwitcherItem isAlternateColor isAlternateFontFace isSmall />
      </SchemeSwitcherStyle>
    </Fragment>
  );
};

const SchemeSwitcherItem = (props) => {
  const onClick = () => {
    // @TODO
  };

  return (
    <SchemeSwitcherItemStyle onClick={onClick} {...props}>
      <span>Aa</span>
    </SchemeSwitcherItemStyle>
  );
};

SchemeSwitcherItem.propTypes = {
  isAlternateColor: PropTypes.bool,
  isAlternateFontFace: PropTypes.bool,
  isSmall: PropTypes.bool,
};

const SchemeSwitcherStyle = styled.ul`
  display: flex;

  margin: 0;
  padding: 0;

  list-style: none;

  align-items: end;
  justify-content: center;
`;

const SchemeSwitcherItemStyle = styled.li`
  display: flex;

  width: ${(props) => (props.isSmall ? '3.5rem' : '4.5rem')};
  height: ${(props) => (props.isSmall ? '3.5rem' : '4.5rem')};

  margin: 0.5rem;
  padding: 0.5rem;

  border: 1px solid
    ${(props) =>
      props.isAlternateColor ? styles.colors.black : styles.colors.violet};
  border-radius: 0.5rem;

  color: ${(props) =>
    props.isAlternateColor ? styles.colors.yellow : styles.colors.violet};

  background-color: ${(props) =>
    props.isAlternateColor ? styles.colors.black : 'transparent'};

  font-weight: ${styles.typography.weightBold};
  font-size: ${(props) => (props.isSmall ? '1.5em' : '2em')};
  font-family: ${(props) =>
    props.isAlternateFontFace
      ? styles.typography.familyAccessible
      : styles.typography.familyHeading};

  line-height: 1;

  align-items: center;
  justify-content: center;

  cursor: pointer;

  ${(props) => {
    // Hack to align alternate font in center
    if (props.isAlternateFontFace) {
      return `
        span {
          position: relative;

          top: 2px;
        }
      `;
    }
  }};
`;

export default SchemeSwitcher;
