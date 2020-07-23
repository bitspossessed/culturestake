import React, { Fragment } from 'react';

import BoothContainer from '~/client/components/BoothContainer';
import ColorSection from '~/client/components/ColorSection';
import View from '~/client/components/View';
import { ContainerStyle } from '~/client/styles/layout';

const Booth = () => {
  return (
    <Fragment>
      <View>
        <ColorSection>
          <ContainerStyle>
            <BoothContainer>Huhu!</BoothContainer>
          </ContainerStyle>
        </ColorSection>
      </View>
    </Fragment>
  );
};

export default Booth;
