import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';

import EthereumContainer from '~/client/components/EthereumContainer';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';

const Admin = () => {
  return (
    <Fragment>
      <HeaderAdmin>{translate('Admin.title')}</HeaderAdmin>

      <ViewAdmin>
        <EthereumContainer>Hello, Ethereum!</EthereumContainer>
      </ViewAdmin>
    </Fragment>
  );
};

export default Admin;
