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
  path: ['organisations'],
  columns: [
    {
      isOrderKey: true,
      key: 'name',
      label: translate('AdminOrganisations.fieldName'),
    },
  ],
  actions: [
    {
      label: translate('default.tableActionEdit'),
      key: ACTION_EDIT,
    },
  ],
};

const AdminOrganisations = () => {
  const history = useHistory();

  const onSelect = ({ item: { slug } }) => {
    history.push(`/admin/organisations/${slug}/edit`);
  };

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminOrganisations.title')}</HeaderAdmin>

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
          <ButtonIcon to="/admin/organisations/new" url={swirl}>
            {translate('AdminOrganisations.buttonNewQuestion')}
          </ButtonIcon>

          <ButtonIcon isIconFlipped to="/admin">
            {translate('default.buttonReturnToDashboard')}
          </ButtonIcon>
        </SpacingGroupStyle>
      </FooterAdmin>
    </Fragment>
  );
};

export default AdminOrganisations;
