import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import styles from '~/client/styles/variables';
import { updateAccessibilitySettings } from '~/client/store/app/actions';

const ACCESSIBILITY_SETTINGS = [
  'isAlternateColor',
  'isAlternateFontFace',
  'isLargerFont',
];

const AccessibilitySettings = () => {
  return (
    <Fragment>
      <AccessibilitySettingsStyle>
        <AccessibilitySettingsItem isLargerFont />
        <AccessibilitySettingsItem />
        <AccessibilitySettingsItem isAlternateFontFace isLargerFont />
        <AccessibilitySettingsItem isAlternateFontFace />
      </AccessibilitySettingsStyle>

      <AccessibilitySettingsStyle>
        <AccessibilitySettingsItem isAlternateColor isLargerFont />
        <AccessibilitySettingsItem isAlternateColor />

        <AccessibilitySettingsItem
          isAlternateColor
          isAlternateFontFace
          isLargerFont
        />

        <AccessibilitySettingsItem isAlternateColor isAlternateFontFace />
      </AccessibilitySettingsStyle>
    </Fragment>
  );
};

const AccessibilitySettingsItem = (props) => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(
      updateAccessibilitySettings(
        ACCESSIBILITY_SETTINGS.reduce((acc, key) => {
          acc[key] = !!props[key];
          return acc;
        }, {}),
      ),
    );
  };

  const app = useSelector((state) => state.app);

  const isSelected = ACCESSIBILITY_SETTINGS.reduce((acc, key) => {
    return acc && !!props[key] === app[key];
  }, true);

  return (
    <AccessibilitySettingsItemStyle
      isSelected={isSelected}
      onClick={onClick}
      {...props}
    >
      <span>Aa</span>
    </AccessibilitySettingsItemStyle>
  );
};

AccessibilitySettings.propTypes = {
  isAlternateColor: PropTypes.bool,
  isAlternateFontFace: PropTypes.bool,
  isSmall: PropTypes.bool,
};

const AccessibilitySettingsStyle = styled.ul`
  display: flex;

  margin: 0;
  padding: 0;

  list-style: none;

  align-items: end;
  justify-content: center;
`;

const AccessibilitySettingsItemStyle = styled.li`
  display: flex;

  width: ${(props) => (props.isLargerFont ? '4.5rem' : '3.5rem')};
  height: ${(props) => (props.isLargerFont ? '4.5rem' : '3.5rem')};

  margin: 0.5rem;
  padding: 0.5rem;

  border-width: ${(props) => (props.isSelected ? '2px' : '1px')};
  border-style: solid;
  border-color: ${(props) =>
    props.isAlternateColor
      ? props.isSelected
        ? styles.colors.yellow
        : styles.colors.black
      : styles.colors.violet};
  border-radius: 0.5rem;

  color: ${(props) =>
    props.isAlternateColor ? styles.colors.yellow : styles.colors.violet};

  background-color: ${(props) =>
    props.isAlternateColor ? styles.colors.black : 'transparent'};

  font-weight: ${styles.typography.weightBold};
  font-size: ${(props) => (props.isLargerFont ? '2em' : '1.5em')};
  font-family: ${(props) =>
    props.isAlternateFontFace
      ? styles.typography.familyAccessible
      : styles.typography.familyHeading};

  line-height: 1;

  align-items: center;
  justify-content: center;

  cursor: pointer;

  span {
    position: relative;

    top: ${(props) => (props.isAlternateFontFace ? '2px' : null)};
  }
`;

export default AccessibilitySettings;
