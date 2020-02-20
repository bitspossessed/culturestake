import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';

import Footer from '~/client/components/Footer';
import Header from '~/client/components/Header';
import View from '~/client/components/View';

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
