import React from 'react';
import styled from 'styled-components';

import SchemeSwitcher from '~/client/components/SchemeSwitcher';
import styles from '~/client/styles/variables';

const Navigation = () => {
  return (
    <NavigationStyle>
      <NavigationAccessibilityStyle>
        <h2>Accessibility</h2>
        <SchemeSwitcher />
      </NavigationAccessibilityStyle>

      <NavigationMenuStyle>
        <NavigationMenuItemStyle>
          <h2>Festivals:</h2>
        </NavigationMenuItemStyle>

        <NavigationMenuItemStyle>{/* @TODO */}</NavigationMenuItemStyle>
      </NavigationMenuStyle>
    </NavigationStyle>
  );
};

const NavigationStyle = styled.nav`
  position: fixed;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: ${styles.layers.Navigation};

  background-color: ${styles.colors.violet};
`;

const NavigationAccessibilityStyle = styled.div`
  padding: ${styles.layout.spacing};
  padding-bottom: 4rem;

  background-color: ${styles.colors.white};

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
