import PropTypes from 'prop-types';
import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Table, { ACTION_EDIT } from '~/client/components/Table';
import translate from '~/common/services/i18n';

const table = {
  path: ['answers'],
  actions: [
    {
      label: translate('AnswersTable.buttonEdit'),
      key: ACTION_EDIT,
    },
  ],
};

const tableArtworkColumns = [
  {
    key: 'artwork.title',
    isOrderKey: false,
    label: translate('AnswersTable.fieldTitle'),
  },
];

const tablePropertyColumns = [
  {
    key: 'property.title',
    isOrderKey: false,
    label: translate('AnswersTable.fieldTitle'),
  },
];

const AnswersTable = ({ isArtworkQuestion, isInitialized }) => {
  const { questionId } = useParams();
  const history = useHistory();
  const { isOwner } = useSelector((state) => state.ethereum);

  const onSelect = ({ item: { id } }) => {
    history.push(`/admin/questions/${questionId}/answers/${id}/edit`);
  };

  const columns = isArtworkQuestion
    ? tablePropertyColumns
    : tableArtworkColumns;

  return (
    <Table
      actions={isOwner && isInitialized ? table.actions : []}
      columns={columns}
      path={table.path}
      query={questionId}
      queryParam="questionId"
      onSelect={isOwner && isInitialized ? onSelect : () => {}}
    />
  );
};

AnswersTable.propTypes = {
  isArtworkQuestion: PropTypes.bool.isRequired,
  isInitialized: PropTypes.bool.isRequired,
};

export default AnswersTable;
