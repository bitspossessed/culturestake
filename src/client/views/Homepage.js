import React, { Fragment } from 'react';

import ColorSection from '~/client/components/ColorSection';
import ThreeSplash from '~/client/components/ThreeSplash';
import View from '~/client/components/View';
import { ParagraphStyle } from '~/client/styles/typography';

const Homepage = () => {
  return (
    <Fragment>
      <View>
        <ThreeSplash />

        <ColorSection>
          <ParagraphStyle>
            Quibusdam ad vel itaque. Qui nobis enim ullam. Quis asperiores
            similique aliquid laborum nobis maxime officiis. Quod delectus amet
            ut. Itaque similique qui excepturi sint eaque porro corrupti.
            Adipisci illum ea sint eaque.
          </ParagraphStyle>

          <ParagraphStyle>
            Quibusdam ad vel itaque. Qui nobis enim ullam. Quis asperiores
            similique aliquid laborum nobis maxime officiis. Quod delectus amet
            ut. Itaque similique qui excepturi sint eaque porro corrupti.
            Adipisci illum ea sint eaque.
          </ParagraphStyle>
        </ColorSection>
      </View>
    </Fragment>
  );
};

export default Homepage;
