import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';

import Header from '~/client/components/Header';
import Footer from '~/client/components/Footer';
import View from '~/client/components/View';

const Homepage = () => {
  return (
    <Fragment>
      <Header />

      <View>
        <h1>{translate('Homepage.title')}</h1>
      </View>

      <Footer />
    </Fragment>
  );
};

export default Homepage;
