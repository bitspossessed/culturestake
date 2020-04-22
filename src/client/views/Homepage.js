import React, { Fragment } from 'react';
import styled from 'styled-components';

import ThreeInterface from '~/client/components/ThreeInterface';
import ThreeSplash from '~/client/components/ThreeSplash';
import View from '~/client/components/View';
import styles from '~/client/styles/variables';

const Homepage = () => {
  return (
    <Fragment>
      <ThreeInterface />

      <View>
        <ThreeSplash />

        <Paragraph>
          Quibusdam ad vel itaque. Qui nobis enim ullam. Quis asperiores
          similique aliquid laborum nobis maxime officiis. Quod delectus amet
          ut. Itaque similique qui excepturi sint eaque porro corrupti. Adipisci
          illum ea sint eaque.
        </Paragraph>

        <Paragraph>
          Quibusdam ad vel itaque. Qui nobis enim ullam. Quis asperiores
          similique aliquid laborum nobis maxime officiis. Quod delectus amet
          ut. Itaque similique qui excepturi sint eaque porro corrupti. Adipisci
          illum ea sint eaque.
        </Paragraph>
      </View>
    </Fragment>
  );
};

const Paragraph = styled.p`
  margin: 2rem;

  color: ${styles.colors.violet};
`;

export default Homepage;
