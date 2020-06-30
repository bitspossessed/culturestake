import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import translate from '~/common/services/i18n';

import ButtonIcon from '~/client/components/ButtonIcon';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import Table, { ACTION_EDIT } from '~/client/components/Table';
import ViewAdmin from '~/client/components/ViewAdmin';

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
  const history = useHistory();

  const onSelect = ({ item: { slug } }) => {
    history.push(`/admin/users/${slug}/edit`);
  };

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminUsers.title')}</HeaderAdmin>

      <ViewAdmin>
        <Table
          actions={table.actions}
          columns={table.columns}
          path={table.path}
          onSelect={onSelect}
        />
      </ViewAdmin>

      <FooterAdmin>
        <ButtonIcon to="/admin/users/new">
          {translate('AdminUsers.buttonNewUser')}
        </ButtonIcon>
      </FooterAdmin>
    </Fragment>
  );
};

export default AdminUsers;
