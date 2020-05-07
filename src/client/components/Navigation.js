import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import AccessibilitySettings from '~/client/components/AccessibilitySettings';
import ColorSection from '~/client/components/ColorSection';
import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { HeadingSecondaryStyle } from '~/client/styles/typography';
import { BackgroundAreaStyle } from '~/client/styles/layout';

const Navigation = () => {
  const { isAlternateColor } = useSelector((state) => state.app);

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

          <NavigationMenuItemStyle>{/* @TODO */}</NavigationMenuItemStyle>
        </NavigationMenuStyle>
      </ColorSection>
    </NavigationStyle>
  );
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

  font-family: ${styles.typography.family};

  text-align: center;

  h2 {
    margin: 0;
    padding: 0;

    color: ${styles.colors.white};
  }
`;

export default Navigation;
