import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';

import Footer from '~/client/components/Footer';
import Header from '~/client/components/Header';
import Table, { ACTION_EDIT } from '~/client/components/Table';
import View from '~/client/components/View';

const table = {
  path: ['users'],
  columns: [
    {
      isOrderKey: true,
      key: 'username',
      label: translate('AdminUsers.fieldUsername'),
    },
    {
      isOrderKey: true,
      key: 'email',
      label: translate('AdminUsers.fieldEmail'),
    },
  ],
  actions: [
    {
      label: translate('default.tableActionEdit'),
      key: ACTION_EDIT,
    },
  ],
};

const AdminUsers = () => {
  const onSelect = item => {
    // @TODO: Handle actions
  };

  return (
    <Fragment>
      <Header />

      <View>
        <h1>{translate('AdminUsers.title')}</h1>

        <Table
          actions={table.actions}
          columns={table.columns}
          path={table.path}
          onSelect={onSelect}
        />
      </View>

      <Footer />
    </Fragment>
  );
};

export default AdminUsers;
