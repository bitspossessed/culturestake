import React from 'react';
import translate from '~/common/services/i18n';
import { useParams } from 'react-router-dom';

import Table, { ACTION_EDIT } from '~/client/components/Table';

const table = {
  path: ['answers'],
  columns: [
    {
      isOrderKey: true,
      key: 'title',
      label: translate('AnswersTable.fieldTitle'),
    },
  ],
  actions: [
    {
      label: translate('default.tableActionEdit'),
      key: ACTION_EDIT,
    },
  ],
};

const AnswersTable = () => {
  const { questionId } = useParams();

  const onSelect = ({ item: { id } }) => {
    history.push(`/admin/questions/${questionId}/answers/${id}/edit`);
  };

  return (
    <Table
      actions={table.actions}
      columns={table.columns}
      path={table.path}
      searchParams={{ questionId }}
      onSelect={onSelect}
    />
  );
};

export default AnswersTable;
