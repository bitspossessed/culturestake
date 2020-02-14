import React, { Fragment } from 'react';

import Header from '~/components/Header';
import Footer from '~/components/Footer';
import View from '~/components/View';

const Admin = () => {
  return (
    <Fragment>
      <Header />

      <View>
        <h1>Admin</h1>
      </View>

      <Footer />
    </Fragment>
  );
};

export default Admin;
