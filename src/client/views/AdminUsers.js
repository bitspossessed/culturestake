import React, { Fragment } from 'react';

import Footer from '~/client/components/Footer';
import Header from '~/client/components/Header';
import Table, { ACTION_EDIT } from '~/client/components/Table';
import View from '~/client/components/View';

// @TODO: Use I18n for labels
const table = {
  path: ['users'],
  columns: [
    {
      isOrderKey: true,
      key: 'username',
      label: 'Username',
    },
    {
      isOrderKey: true,
      key: 'email',
      label: 'Email',
    },
  ],
  actions: [
    {
      label: 'Edit',
      key: ACTION_EDIT,
    },
  ],
};

const AdminUsers = () => {
  const onSelect = item => {
    // @TODO: Handle actions
  };

  // @TODO: Get current page index from path
  const pageIndex = 0;

  return (
    <Fragment>
      <Header />

      <View>
        <Table
          actions={table.actions}
          columns={table.columns}
          pageIndex={pageIndex}
          path={table.path}
          onSelect={onSelect}
        />
      </View>

      <Footer />
    </Fragment>
  );
};

export default AdminUsers;
