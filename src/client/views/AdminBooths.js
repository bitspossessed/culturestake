import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import translate from '~/common/services/i18n';

import ButtonIcon from '~/client/components/ButtonIcon';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import BoothsTable from '~/client/components/BoothsTable';
import ContractsBooths from '~/client/components/ContractsBooths';
import ViewAdmin from '~/client/components/ViewAdmin';
import { deactivateVotingBooth } from '~/common/services/contracts/booths';
import { useOwnerAddress } from '~/client/hooks/ethereum';
import { addPendingTransaction } from '~/client/store/ethereum/actions';

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
  const { isOwner } = useSelector((state) => state.ethereum);
  const owner = useOwnerAddress();
  const dispatch = useDispatch();

  const onSelect = async ({ item: { id, deactivated } }) => {
    if (!deactivated) {
      const { txHash, txMethod } = await deactivateVotingBooth(owner, id);
      dispatch(
        addPendingTransaction({
          txHash,
          txMethod,
        }),
      );
    }
  };

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminBooths.title')}</HeaderAdmin>

      <ViewAdmin>
        <BoothsTable
          actions={table.actions}
          columns={table.columns}
          isOwner={isOwner}
          onSelect={isOwner ? onSelect : () => {}}
        />
        <ContractsBooths />
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
