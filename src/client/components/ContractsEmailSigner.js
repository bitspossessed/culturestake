import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

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
import { initializeBooth, resetBooth } from '~/client/store/booth/actions';
import ButtonOutline from '~/client/components/ButtonOutline';

const boothAddressSchema = web3Validators.web3().address().required();
const festivalChainIdSchema = web3Validators.web3().sha3().required();

const ContractsEmailSigner = ({
  booth,
  isReadyToSign = false,
  setFestival,
}) => {
  return (
    <EthereumContainer>
      {isReadyToSign ? (
        <ParagraphStyle>
          {translate('ContractsEmailSigner.finishTitle')}
        </ParagraphStyle>
      ) : (
        <ParagraphStyle>
          {translate('ContractsEmailSigner.startTitle')}
        </ParagraphStyle>
      )}

      <ContractsBoothsForm booth={booth} setFestival={setFestival} />
    </EthereumContainer>
  );
};

const ContractsBoothsForm = ({ booth, setFestival }) => {
  const dispatch = useDispatch();
  const owner = useOwnerAddress();

  const onCreateBooth = () => {
    dispatch(initializeBooth());
  };

  const onBurnBooth = () => {
    if (!window.confirm(translate('default.areYouSure'))) {
      return;
    }

    dispatch(resetBooth());
  };

  const { Form, meta, reset } = useContractsForm({
    onSubmit: async ({ boothAddress, festivalChainId }) => {
      const festivalInitialized = await isFestivalInitialized(festivalChainId);
      if (!festivalInitialized) {
        dispatch(
          notify({
            text: translate('ContractsEmailSigner.errorNotInitialized'),
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
        label={translate('ContractsEmailSigner.fieldBoothAddress')}
        name="boothAddress"
        validate={boothAddressSchema}
        value={{ value: booth.address }}
      />

      <InputFinderField
        label={translate('ContractsEmailSigner.fieldFestivalChainId')}
        name="festivalChainId"
        placeholder={translate('ContractsEmailSigner.fieldFestivalPlaceholder')}
        queryPath={['festivals']}
        searchParam={'title'}
        selectParam={'chainId'}
        validate={festivalChainIdSchema}
        onChangeCallback={setFestival}
      />

      <ButtonSubmit disabled={meta.request.isPending}>
        {translate('ContractsEmailSigner.buttonAddNewBooth')}
      </ButtonSubmit>
    </Form>
  ) : booth.isInitialized ? (
    <Fragment>
      <ParagraphStyle>
        <Pill>{booth.address}</Pill>
      </ParagraphStyle>
      <ButtonOutline isDanger={true} onClick={onBurnBooth}>
        {translate('ContractsEmailSigner.buttonBurnBooth')}
      </ButtonOutline>
    </Fragment>
  ) : (
    <ButtonOutline onClick={onCreateBooth}>
      {translate('ContractsEmailSigner.buttonInitializeBooth')}
    </ButtonOutline>
  );
};

ContractsEmailSigner.propTypes = {
  booth: PropTypes.object.isRequired,
  isReadyToSign: PropTypes.bool,
  setFestival: PropTypes.func.isRequired,
};

ContractsBoothsForm.propTypes = {
  booth: PropTypes.object.isRequired,
  setFestival: PropTypes.func.isRequired,
};

export default ContractsEmailSigner;
