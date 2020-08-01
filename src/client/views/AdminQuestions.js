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
  path: ['questions'],
  columns: [
    {
      isOrderKey: true,
      key: 'title',
      label: translate('AdminQuestions.fieldTitle'),
    },
  ],
  actions: [
    {
      label: translate('default.tableActionEdit'),
      key: ACTION_EDIT,
    },
  ],
};

const AdminQuestions = () => {
  const history = useHistory();

  const onSelect = ({ item: { id } }) => {
    history.push(`/admin/questions/${id}/edit`);
  };

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminQuestions.title')}</HeaderAdmin>

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
          <ButtonIcon to="/admin/questions/new" url={swirl}>
            {translate('AdminQuestions.buttonNewQuestion')}
          </ButtonIcon>

          <ButtonIcon isIconFlipped to="/admin">
            {translate('default.buttonReturnToDashboard')}
          </ButtonIcon>
        </SpacingGroupStyle>
      </FooterAdmin>
    </Fragment>
  );
};

export default AdminQuestions;
