import React, { Fragment } from 'react';

import Footer from '~/client/components/Footer';
import Header from '~/client/components/Header';
import View from '~/client/components/View';
import FormLogin from '~/client/components/FormLogin';

const AdminLogin = () => {
  return (
    <Fragment>
      <Header />

      <View>
        <FormLogin />
      </View>

      <Footer />
    </Fragment>
  );
};

export default AdminLogin;
