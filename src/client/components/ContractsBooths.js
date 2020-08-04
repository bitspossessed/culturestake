import React from 'react';
import { useDispatch } from 'react-redux';

import ButtonSubmit from '~/client/components/ButtonSubmit';
import EthereumContainer from '~/client/components/EthereumContainer';
import InputField from '~/client/components/InputField';
import InputFinderField from '~/client/components/InputFinderField';
import { initializeVotingBooth } from '~/common/services/contracts/booths';
import translate from '~/common/services/i18n';
import { addPendingTransaction } from '~/client/store/ethereum/actions';
import { useContractsForm } from '~/client/hooks/forms';
import { useOwnerAddress } from '~/client/hooks/ethereum';
import { web3Validators } from '~/common/helpers/validate';
import { ParagraphStyle } from '~/client/styles/typography';

const boothAddressSchema = web3Validators.web3().address().required();
const festivalChainIdSchema = web3Validators.web3().sha3().required();

const ContractsBooths = () => {
  return (
    <EthereumContainer>
      <ParagraphStyle>{translate('ContractsBooths.title')}</ParagraphStyle>

      <ContractsBoothsForm />
    </EthereumContainer>
  );
};

const ContractsBoothsForm = () => {
  const dispatch = useDispatch();
  const owner = useOwnerAddress();

  const { Form, meta, reset } = useContractsForm({
    onSubmit: async ({ boothAddress, festivalChainId }) => {
      const { txHash, txMethod } = await initializeVotingBooth(
        owner,
        festivalChainId,
        boothAddress,
      );

      dispatch(
        addPendingTransaction({
          txHash,
          txMethod,
        }),
      );
      reset();

      return;
    },
  });

  return (
    <Form>
      <InputField
        label={translate('ContractsBooths.fieldBoothAddress')}
        name="boothAddress"
        validate={boothAddressSchema}
      />

      <InputFinderField
        label={translate('ContractsBooths.fieldFestivalChainId')}
        name="festivalChainId"
        placeholder={translate('ContractsBooths.fieldFestivalChainId')}
        queryPath={['festivals']}
        searchParam={'title'}
        selectParam={'chainId'}
        validate={festivalChainIdSchema}
      />

      <ButtonSubmit disabled={meta.request.isPending}>
        {translate('ContractsBooths.buttonAddNewBooth')}
      </ButtonSubmit>
    </Form>
  );
};

export default ContractsBooths;
