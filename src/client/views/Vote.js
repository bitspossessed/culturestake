import React, { Fragment } from 'react';

import Header from '~/client/components/Header';
import Footer from '~/client/components/Footer';
import View from '~/client/components/View';

const Vote = () => {
  return (
    <Fragment>
      <Header />

      <View>
        <h1>Vote</h1>
      </View>

      <Footer />
    </Fragment>
  );
};

export default Vote;
