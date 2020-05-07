import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';

import Footer from '~/client/components/Footer';
import Header from '~/client/components/Header';

const Admin = () => {
  return (
    <Fragment>
      <Header>
        <h1>{translate('Admin.title')}</h1>
      </Header>

      <Footer />
    </Fragment>
  );
};

export default Admin;
