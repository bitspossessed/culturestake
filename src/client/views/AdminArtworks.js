import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import translate from '~/common/services/i18n';

import ButtonIcon from '~/client/components/ButtonIcon';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import Table, { ACTION_EDIT } from '~/client/components/Table';
import ViewAdmin from '~/client/components/ViewAdmin';

const table = {
  path: ['artworks'],
  columns: [
    {
      isOrderKey: true,
      key: 'title',
      label: translate('AdminArtworks.fieldTitle'),
    },
  ],
  actions: [
    {
      label: translate('default.tableActionEdit'),
      key: ACTION_EDIT,
    },
  ],
};

const AdminArtworks = () => {
  const history = useHistory();

  const onSelect = ({ item: { slug } }) => {
    history.push(`/admin/artworks/${slug}/edit`);
  };

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminArtworks.title')}</HeaderAdmin>

      <ViewAdmin>
        <Table
          actions={table.actions}
          columns={table.columns}
          path={table.path}
          onSelect={onSelect}
        />
      </ViewAdmin>

      <FooterAdmin>
        <ButtonIcon to="/admin/artworks/new">
          {translate('AdminArtworks.buttonNewQuestion')}
        </ButtonIcon>
      </FooterAdmin>
    </Fragment>
  );
};

export default AdminArtworks;
