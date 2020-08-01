import PropTypes from 'prop-types';
import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import ButtonOutline, {
  ButtonOutlineStyle,
} from '~/client/components/ButtonOutline';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import EthereumContainer from '~/client/components/EthereumContainer';
import InputField from '~/client/components/InputField';
import {
  TX_ADD_OWNER,
  TX_REMOVE_OWNER,
  addOwner,
  getOwners,
  removeOwner,
} from '~/common/services/contracts/owners';
import translate from '~/common/services/i18n';
import { ParagraphStyle } from '~/client/styles/typography';
import { addPendingTransaction } from '~/client/store/ethereum/actions';
import { useContractsForm } from '~/client/hooks/forms';
import {
  usePendingTransaction,
  useOwnerAddress,
} from '~/client/hooks/ethereum';
import { web3Validators } from '~/common/helpers/validate';

const ownerAddressSchema = web3Validators.web3().address().required();

const ContractsOwners = () => {
  const dispatch = useDispatch();
  const senderAddress = useOwnerAddress();

  const { isPending: isRemovePending } = usePendingTransaction({
    txMethod: TX_REMOVE_OWNER,
  });

  const { isPending: isAddPending } = usePendingTransaction({
    txMethod: TX_ADD_OWNER,
  });

  const [owners, setOwners] = useState([]);

  const updateOwnersList = async () => {
    const response = await getOwners();
    setOwners(response);
  };

  const onClickRemove = useCallback(
    async (ownerAddress) => {
      const { txHash, txMethod } = await removeOwner(
        senderAddress,
        ownerAddress,
      );

      dispatch(
        addPendingTransaction({
          txHash,
          txMethod,
        }),
      );
    },
    [senderAddress, dispatch],
  );

  useEffect(() => {
    updateOwnersList();
  }, [isAddPending, isRemovePending]);

  const isPending = isAddPending || isRemovePending;

  return (
    <EthereumContainer isPending={isPending}>
      <ParagraphStyle>{translate('ContractsOwners.title')}</ParagraphStyle>

      {owners.length > 0 && (
        <ContractsOwnersList
          isDisabled={isRemovePending}
          owners={owners}
          onRemove={onClickRemove}
        />
      )}

      <ContractsOwnersForm />
    </EthereumContainer>
  );
};

const ContractsOwnersForm = () => {
  const dispatch = useDispatch();
  const senderAddress = useOwnerAddress();

  const { Form, meta, reset } = useContractsForm({
    onSubmit: async ({ ownerAddress }) => {
      const result = await addOwner(senderAddress, ownerAddress);

      dispatch(
        addPendingTransaction({
          txHash: result.txHash,
          txMethod: TX_ADD_OWNER,
        }),
      );

      reset();

      return result;
    },
  });

  return (
    <Form>
      <InputField
        label={translate('ContractsOwners.fieldOwnerAddress')}
        name="ownerAddress"
        validate={ownerAddressSchema}
      />

      <ButtonSubmit disabled={meta.request.isPending}>
        {translate('ContractsOwners.buttonAddNewOwner')}
      </ButtonSubmit>
    </Form>
  );
};

const ContractsOwnersList = ({ isDisabled, owners, onRemove }) => {
  return (
    <ContractsOwnersStyle>
      {owners.map((ownerAddress) => {
        return (
          <ContractsOwnersListItem
            isDisabled={isDisabled}
            key={ownerAddress}
            ownerAddress={ownerAddress}
            onRemove={onRemove}
          />
        );
      })}
    </ContractsOwnersStyle>
  );
};

const ContractsOwnersListItem = ({ isDisabled, ownerAddress, onRemove }) => {
  const onClickRemove = () => {
    onRemove(ownerAddress);
  };

  return (
    <ContractsOwnersItemStyle>
      <ContractsOwnersAddressStyle>{ownerAddress}</ContractsOwnersAddressStyle>

      <ButtonOutline disabled={isDisabled} onClick={onClickRemove}>
        {translate('ContractsOwners.buttonRemoveOwner')}
      </ButtonOutline>
    </ContractsOwnersItemStyle>
  );
};

ContractsOwnersList.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
  owners: PropTypes.array.isRequired,
};

ContractsOwnersListItem.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
  ownerAddress: PropTypes.string.isRequired,
};

const ContractsOwnersStyle = styled.ul`
  padding: 0;
  padding-left: 2rem;
`;

const ContractsOwnersItemStyle = styled.li`
  margin-top: 0.5rem;

  ${ButtonOutlineStyle} {
    margin: 0;
  }
`;

const ContractsOwnersAddressStyle = styled.span`
  padding-right: 1rem;
`;

export default ContractsOwners;
