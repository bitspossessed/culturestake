import React, { Fragment } from 'react';

import ContractsOwners from '~/client/components/ContractsOwners';
import PayerBalance from '~/client/components/PayerBalance';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import translate from '~/common/services/i18n';

const Admin = () => {
  return (
    <Fragment>
      <HeaderAdmin>{translate('Admin.title')}</HeaderAdmin>

      <ViewAdmin>
        <PayerBalance />
        <ContractsOwners />
      </ViewAdmin>
    </Fragment>
  );
};

export default Admin;
