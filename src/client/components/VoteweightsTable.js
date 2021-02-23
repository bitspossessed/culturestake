import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Table, { ACTION_DESTROY } from '~/client/components/Table';
import translate from '~/common/services/i18n';
import { destroyRequest } from '~/client/store/api/actions';

const table = {
  path: ['voteweights'],
  actions: [
    {
      label: translate('VoteweightsTable.buttonDelete'),
      isDangerous: true,
      key: ACTION_DESTROY,
    },
  ],
  columns: [
    {
      key: 'type',
      isOrderKey: false,
      label: translate('VoteweightsTable.fieldType'),
    },
    {
      key: 'strength',
      isOrderKey: false,
      label: translate('VoteweightsTable.fieldStrength'),
    },
  ],
};

const VoteweightsTable = () => {
  const dispatch = useDispatch();
  const { festivalSlug } = useParams();

  const onSelect = ({ item }) => {
    if (!window.confirm(translate('default.areYouSure'))) {
      return;
    }

    dispatch(
      destroyRequest({
        path: ['voteweights', item.id],
      }),
    );
  };

  return (
    <Table
      actions={table.actions}
      columns={table.columns}
      path={table.path}
      query={festivalSlug}
      queryParam="festivalSlug"
      onSelect={onSelect}
    />
  );
};

export default VoteweightsTable;
