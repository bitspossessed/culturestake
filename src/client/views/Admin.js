import React, { Fragment } from 'react';

import translate from '%/services/i18n';

import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';

const Admin = () => {
  return (
    <Fragment>
      <Header />

      <View>
        <h1>{translate('admin')}</h1>
      </View>

      <Footer />
    </Fragment>
  );
};

export default Admin;
