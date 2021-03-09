import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ButtonSubmit from '~/client/components/ButtonSubmit';
import EthereumContainer from '~/client/components/EthereumContainer';
import InputHiddenField from '~/client/components/InputHiddenField';
import Pill from '~/client/components/Pill';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import InputFinderField from '~/client/components/InputFinderField';
import { initializeVotingBooth } from '~/common/services/contracts/booths';
import { isFestivalInitialized } from '~/common/services/contracts/festivals';
import translate from '~/common/services/i18n';
import { addPendingTransaction } from '~/client/store/ethereum/actions';
import { useContractsForm } from '~/client/hooks/forms';
import { useOwnerAddress } from '~/client/hooks/ethereum';
import { web3Validators } from '~/common/helpers/validate';
import { ParagraphStyle } from '~/client/styles/typography';
import { initializeBooth } from '~/client/store/booth/actions';
import ButtonOutline from '~/client/components/ButtonOutline';

const boothAddressSchema = web3Validators.web3().address().required();
const festivalChainIdSchema = web3Validators.web3().sha3().required();

const ContractsEmailSigner = () => {
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
  const booth = useSelector((state) => state.booth);

  const onCreateBooth = () => {
    dispatch(initializeBooth());
  };

  const { Form, meta, reset } = useContractsForm({
    onSubmit: async ({ boothAddress, festivalChainId }) => {
      const festivalInitialized = await isFestivalInitialized(festivalChainId);
      if (!festivalInitialized) {
        dispatch(
          notify({
            text: translate('ContractsBooths.errorNotInitialized'),
            type: NotificationsTypes.ERROR,
          }),
        );
        reset();
        return;
      }
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

  return booth.address && !booth.isInitialized && !booth.isDeactivated ? (
    <Form>
      <InputHiddenField
        label={translate('ContractsBooths.fieldBoothAddress')}
        name="boothAddress"
        validate={boothAddressSchema}
        value={{ value: booth.address }}
      />

      <InputFinderField
        label={translate('ContractsBooths.fieldFestivalChainId')}
        name="festivalChainId"
        placeholder={translate('ContractsBooths.fieldFestivalPlaceholder')}
        queryPath={['festivals']}
        searchParam={'title'}
        selectParam={'chainId'}
        validate={festivalChainIdSchema}
      />

      <ButtonSubmit disabled={meta.request.isPending}>
        {translate('ContractsBooths.buttonAddNewBooth')}
      </ButtonSubmit>
    </Form>
  ) : booth.isInitialized ? (
    <Fragment>
      <ParagraphStyle>
        {translate('BoothContainer.notfound')}
        <Pill>{booth.address}</Pill>
      </ParagraphStyle>
    </Fragment>
  ) : (
    <ButtonOutline onClick={onCreateBooth}>
      {translate('BoothContainer.buttonInitializeBooth')}
    </ButtonOutline>
  );
};

export default ContractsEmailSigner;
