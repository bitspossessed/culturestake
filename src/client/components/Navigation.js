import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AccessibilitySettings from '~/client/components/AccessibilitySettings';
import ColorSection from '~/client/components/ColorSection';
import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import {
  ParagraphStyle,
  HeadingSecondaryStyle,
} from '~/client/styles/typography';
import { BackgroundAreaStyle } from '~/client/styles/layout';

const Navigation = ({ onClickItem }) => {
  const { isAuthenticated, isAlternateColor } = useSelector(
    (state) => state.app,
  );

  return (
    <NavigationStyle isAlternateColor={isAlternateColor}>
      <ColorSection>
        <NavigationAccessibilityStyle>
          <HeadingSecondaryStyle>
            {translate('Navigation.titleAccessibility')}
          </HeadingSecondaryStyle>

          <AccessibilitySettings />
        </NavigationAccessibilityStyle>
      </ColorSection>

      <ColorSection isInverted>
        <NavigationMenuStyle>
          <NavigationMenuItemStyle>
            <HeadingSecondaryStyle>
              {translate('Navigation.titleFestivals')}
            </HeadingSecondaryStyle>
          </NavigationMenuItemStyle>

          <NavigationMenuItemStyle>
            {/* @TODO: Fetch festivals and display them here */}
            <ParagraphStyle>%</ParagraphStyle>
          </NavigationMenuItemStyle>
        </NavigationMenuStyle>

        {isAuthenticated ? (
          <NavigationMenuStyle>
            <NavigationMenuItemStyle>
              <HeadingSecondaryStyle>
                {translate('Navigation.titleAdmin')}
              </HeadingSecondaryStyle>
            </NavigationMenuItemStyle>

            <NavigationMenuItemStyle>
              <NavigationLink to="/admin" onClick={onClickItem}>
                <ParagraphStyle>
                  {translate('Navigation.linkAdminDashboard')}
                </ParagraphStyle>
              </NavigationLink>
            </NavigationMenuItemStyle>

            <NavigationMenuItemStyle>
              <NavigationLink to="/admin/users" onClick={onClickItem}>
                <ParagraphStyle>
                  {translate('Navigation.linkAdminUsers')}
                </ParagraphStyle>
              </NavigationLink>
            </NavigationMenuItemStyle>

            <NavigationMenuItemStyle>
              <NavigationLink to="/admin/festivals" onClick={onClickItem}>
                <ParagraphStyle>
                  {translate('Navigation.linkAdminFestivals')}
                </ParagraphStyle>
              </NavigationLink>
            </NavigationMenuItemStyle>
          </NavigationMenuStyle>
        ) : null}
      </ColorSection>
    </NavigationStyle>
  );
};

const NavigationLink = (props) => {
  const onClick = () => {
    props.onClick(props.to);
  };

  return (
    <Link to={props.to} onClick={onClick}>
      {props.children}
    </Link>
  );
};

Navigation.propTypes = {
  onClickItem: PropTypes.func.isRequired,
};

NavigationLink.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  to: PropTypes.string.isRequired,
};

const NavigationStyle = styled(BackgroundAreaStyle)`
  position: fixed;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: ${styles.layers.Navigation};
`;

const NavigationAccessibilityStyle = styled(BackgroundAreaStyle)`
  padding: ${styles.layout.spacing};
  padding-bottom: 4rem;

  text-align: center;

  justify-content: center;

  h2 {
    color: ${styles.colors.violet};
  }
`;

const NavigationMenuStyle = styled.ul`
  margin: 0;
  padding: ${styles.layout.spacing};
  padding-top: 4rem;

  list-style: none;
`;

const NavigationMenuItemStyle = styled.li`
  margin-bottom: 1rem;

  font-family: ${styles.typography.familyHeading};

  text-align: center;

  a {
    font-size: 1.5em;
  }

  h2 {
    margin: 0;
    padding: 0;
  }
`;

export default Navigation;
