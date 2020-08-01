import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import ButtonIcon from '~/client/components/ButtonIcon';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import Table, { ACTION_EDIT } from '~/client/components/Table';
import ViewAdmin from '~/client/components/ViewAdmin';
import swirl from '~/client/assets/images/swirl.svg';
import translate from '~/common/services/i18n';
import { SpacingGroupStyle } from '~/client/styles/layout';

const table = {
  path: ['artists'],
  columns: [
    {
      isOrderKey: true,
      key: 'name',
      label: translate('AdminArtists.fieldName'),
    },
  ],
  actions: [
    {
      label: translate('default.tableActionEdit'),
      key: ACTION_EDIT,
    },
  ],
};

const AdminArtists = () => {
  const history = useHistory();

  const onSelect = ({ item: { slug } }) => {
    history.push(`/admin/artists/${slug}/edit`);
  };

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminArtists.title')}</HeaderAdmin>

      <ViewAdmin>
        <Table
          actions={table.actions}
          columns={table.columns}
          path={table.path}
          onSelect={onSelect}
        />
      </ViewAdmin>

      <FooterAdmin>
        <SpacingGroupStyle>
          <ButtonIcon to="/admin/artists/new" url={swirl}>
            {translate('AdminArtists.buttonNewQuestion')}
          </ButtonIcon>

          <ButtonIcon isIconFlipped to="/admin">
            {translate('default.buttonReturnToDashboard')}
          </ButtonIcon>
        </SpacingGroupStyle>
      </FooterAdmin>
    </Fragment>
  );
};

export default AdminArtists;
