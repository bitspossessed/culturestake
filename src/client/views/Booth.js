import React, { Fragment } from 'react';

import BoothContainer from '~/client/components/BoothContainer';
import ColorSection from '~/client/components/ColorSection';
import View from '~/client/components/View';
import VoteSessionCreator from '~/client/components/VoteSessionCreator';
import { ContainerStyle } from '~/client/styles/layout';

const Booth = () => {
  return (
    <Fragment>
      <View>
        <ColorSection>
          <ContainerStyle>
            <BoothContainer>
              <VoteSessionCreator />
            </BoothContainer>
          </ContainerStyle>
        </ColorSection>
      </View>
    </Fragment>
  );
};

export default Booth;
