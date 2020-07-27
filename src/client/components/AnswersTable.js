import React from 'react';
import PropTypes from 'prop-types';
import translate from '~/common/services/i18n';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Table, { ACTION_EDIT } from '~/client/components/Table';

const table = {
  path: ['answers'],
  columns: [
    {
      isOrderKey: true,
      key: 'artwork.title',
      label: translate('AnswersTable.fieldTitle'),
    },
  ],
  actions: [
    {
      label: translate('AnswersTable.buttonEdit'),
      key: ACTION_EDIT,
    },
  ],
};

const AnswersTable = ({ isArtworkQuestion }) => {
  const { questionId } = useParams();
  const history = useHistory();
  const { isOwner } = useSelector((state) => state.ethereum);

  const onSelect = ({ item: { id } }) => {
    history.push(`/admin/questions/${questionId}/answers/${id}/edit`);
  };

  const columns = isArtworkQuestion
    ? [
        {
          isOrderKey: true,
          key: 'property.title',
          label: translate('AnswersTable.fieldTitle'),
        },
      ]
    : [
        {
          isOrderKey: true,
          key: 'artwork.title',
          label: translate('AnswersTable.fieldTitle'),
        },
      ];

  return (
    <Table
      actions={isOwner ? table.actions : []}
      columns={columns}
      path={table.path}
      searchParams={{ questionId }}
      onSelect={isOwner ? onSelect : () => {}}
    />
  );
};

AnswersTable.propTypes = {
  isArtworkQuestion: PropTypes.bool.isRequired,
};

export default AnswersTable;
