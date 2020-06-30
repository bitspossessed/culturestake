import React, { Fragment } from 'react';

import ButtonIcon from '~/client/components/ButtonIcon';
import ColorSection from '~/client/components/ColorSection';
import HorizontalLine from '~/client/components/HorizontalLine';
import ThreeSplash from '~/client/components/ThreeSplash';
import View from '~/client/components/View';
import translate from '~/common/services/i18n';
import { ContainerStyle } from '~/client/styles/layout';
import { ParagraphStyle } from '~/client/styles/typography';

const Homepage = () => {
  return (
    <Fragment>
      <View>
        <ThreeSplash />

        <ColorSection>
          <ContainerStyle>
            <ParagraphStyle>
              Quibusdam ad vel itaque. Qui nobis enim ullam. Quis asperiores
              similique aliquid laborum nobis maxime officiis. Quod delectus
              amet ut. Itaque similique qui excepturi sint eaque porro corrupti.
              Adipisci illum ea sint eaque.
            </ParagraphStyle>

            <ParagraphStyle>
              Quibusdam ad vel itaque. Qui nobis enim ullam. Quis asperiores
              similique aliquid laborum nobis maxime officiis. Quod delectus
              amet ut. Itaque similique qui excepturi sint eaque porro corrupti.
              Adipisci illum ea sint eaque.
            </ParagraphStyle>

            <HorizontalLine />
            {/* @TODO: Insert statistics here */}
            {/* <HorizontalLine /> */}

            <ButtonIcon to="/festivals">
              {translate('Homepage.buttonViewFestivals')}
            </ButtonIcon>
          </ContainerStyle>
        </ColorSection>
      </View>
    </Fragment>
  );
};

export default Homepage;
