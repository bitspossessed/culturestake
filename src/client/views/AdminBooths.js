import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import translate from '~/common/services/i18n';

import ButtonIcon from '~/client/components/ButtonIcon';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import BoothsTable from '~/client/components/BoothsTable';
import ViewAdmin from '~/client/components/ViewAdmin';

const table = {
  path: ['artists'],
  columns: [
    {
      key: 'id',
      label: translate('AdminBooths.fieldAddress'),
    },
    {
      key: 'festival.id',
      label: translate('AdminBooths.fieldFestival'),
    },
  ],
  actions: [{ label: translate('AdminBooths.fieldAction') }],
};

const AdminBooths = () => {
  const history = useHistory();
  const { isOwner } = useSelector((state) => state.ethereum);

  const onSelect = ({ item: { address } }) => {
    history.push(`/admin/booths/${address}/edit`);
  };

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminBooths.title')}</HeaderAdmin>

      <ViewAdmin>
        <BoothsTable
          actions={isOwner ? table.actions : []}
          columns={table.columns}
          path={table.path}
          onSelect={isOwner ? onSelect : () => {}}
        />
      </ViewAdmin>

      <FooterAdmin>
        <ButtonIcon to="/admin">
          {translate('default.buttonReturnToOverview')}
        </ButtonIcon>
      </FooterAdmin>
    </Fragment>
  );
};

export default AdminBooths;
