import React, { Fragment } from 'react';

import Footer from '~/client/components/Footer';
import Header from '~/client/components/Header';
import View from '~/client/components/View';
import FormLogin from '~/client/components/FormLogin';

const AdminLogin = () => {
  const onSuccess = () => {};

  const onError = () => {};

  return (
    <Fragment>
      <Header />

      <View>
        <h1>Login</h1>
        <FormLogin onError={onError} onSuccess={onSuccess} />
      </View>

      <Footer />
    </Fragment>
  );
};

export default AdminLogin;
