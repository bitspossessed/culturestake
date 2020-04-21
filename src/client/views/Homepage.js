import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';

import ThreeInterface from '~/client/components/ThreeInterface';
import View from '~/client/components/View';

const Homepage = () => {
  return (
    <Fragment>
      <ThreeInterface isShowingInfo />

      <View>
        <h1>{translate('Homepage.title')}</h1>
      </View>
    </Fragment>
  );
};

export default Homepage;
