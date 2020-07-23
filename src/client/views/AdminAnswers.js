import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import translate from '~/common/services/i18n';

import ButtonIcon from '~/client/components/ButtonIcon';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import Table, { ACTION_EDIT } from '~/client/components/Table';
import ViewAdmin from '~/client/components/ViewAdmin';

const table = {
  path: ['answers'],
  columns: [
    {
      isOrderKey: true,
      key: 'title',
      label: translate('AdminAnswers.fieldTitle'),
    },
  ],
  actions: [
    {
      label: translate('default.tableActionEdit'),
      key: ACTION_EDIT,
    },
  ],
};

const AdminAnswers = () => {
  const history = useHistory();
  const { questionId } = useParams();

  const onSelect = ({ item: { id } }) => {
    history.push(`/admin/questions/${questionId}/answers/${id}/edit`);
  };

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminAnswers.title')}</HeaderAdmin>

      <ViewAdmin>
        <Table
          actions={table.actions}
          columns={table.columns}
          path={table.path}
          onSelect={onSelect}
        />
      </ViewAdmin>

      <FooterAdmin>
        <ButtonIcon to={`/admin/questions/${questionId}/answers/new`}>
          {translate('AdminAnswers.buttonNewQuestion')}
        </ButtonIcon>
      </FooterAdmin>
    </Fragment>
  );
};

export default AdminAnswers;
