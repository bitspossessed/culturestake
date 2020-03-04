import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import translate from '~/common/services/i18n';

import Footer from '~/client/components/Footer';
import Header from '~/client/components/Header';
import View from '~/client/components/View';

const Admin = () => {
  return (
    <Fragment>
      <Header>
        <h1>{translate('Admin.title')}</h1>
      </Header>

      <View>
        <Link to="/admin/users">Users</Link>
      </View>

      <Footer />
    </Fragment>
  );
};

export default Admin;
