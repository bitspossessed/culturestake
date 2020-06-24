import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';

import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';

const Admin = () => {
  return (
    <Fragment>
      <HeaderAdmin>{translate('Admin.title')}</HeaderAdmin>
      <ViewAdmin />
    </Fragment>
  );
};

export default Admin;
