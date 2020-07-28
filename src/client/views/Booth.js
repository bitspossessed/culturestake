import React, { Fragment } from 'react';

import BoothContainer from '~/client/components/BoothContainer';
import ColorSection from '~/client/components/ColorSection';
import View from '~/client/components/View';
import VoteSessionCreator from '~/client/components/VoteSessionCreator';

const Booth = () => {
  return (
    <Fragment>
      <View>
        <ColorSection>
          <BoothContainer>
            <VoteSessionCreator />
          </BoothContainer>
        </ColorSection>
      </View>
    </Fragment>
  );
};

export default Booth;
