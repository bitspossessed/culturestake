import React, { Fragment, useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Joi from 'joi';

import ButtonIcon from '~/client/components/ButtonIcon';
import FileUpload from '~/client/components/FileUpload';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import InputFinderField from '~/client/components/InputFinderField';
import ContractsEmailSigner from '~/client/components/ContractsEmailSigner';
import translate from '~/common/services/i18n';
import { HelpCopyStyle, SpacingGroupStyle } from '~/client/styles/layout';
import { ParagraphStyle, PreStyle } from '~/client/styles/typography';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import { useRequestId } from '~/client/hooks/requests';
import { putRequest } from '~/client/store/api/actions';
import FormScheduleEmail, {
  schema,
} from '~/client/components/FormScheduleEmail';
import { useRequestForm } from '~/client/hooks/forms';
import apiRequest from '~/client/services/api';
import { signBooth } from '~/common/services/vote';
import { BOOTH_ACCOUNT_NAME, resetBooth } from '~/client/store/booth/actions';
import { getPrivateKey } from '~/client/services/wallet';

const AdminEmails = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const requestId = useRequestId();
  const booth = useSelector((state) => state.booth);
  const [isReadyToSign, setIsReadyToSign] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [festivalQuestionId, setFestivalQuestionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState(false);

  const organisationSchema = Joi.number()
    .allow(null)
    .error(new Error(translate('validations.artworkRequired')));

  const returnUrl = '/admin';

  useEffect(() => {
    setIsReadyToSign(booth.address && booth.isInitialized && !booth.isDisabled);
  }, [booth, setIsReadyToSign]);

  useEffect(() => {
    if (isReadyToSign) {
      setIsLoading(true);
      const resolve = async () => {
        try {
          if (!booth.festivalChainId) return;
          const resources = await apiRequest({
            path: ['festivals', booth.festivalChainId, 'questions'],
          });
          setSelectedFestival(resources);
          setIsLoading(false);
          setPrivateKey(getPrivateKey(BOOTH_ACCOUNT_NAME));
        } catch (error) {
          dispatch(
            notify({
              text: translate('AdminEmails.errorUnknownFestivalChainId'),
              type: NotificationsTypes.ERROR,
            }),
          );
        }
      };

      resolve();
    }
  }, [
    booth,
    isReadyToSign,
    setSelectedFestival,
    setIsLoading,
    dispatch,
    setPrivateKey,
  ]);

  const festivalAnswerIds = useMemo(() => {
    if (!selectedFestival) return [];

    if (!selectedFestival.questions) {
      return [];
    }

    try {
      const result = selectedFestival.questions.reduce((acc, question) => {
        if (question.artworkId === null) {
          setFestivalQuestionId(question.id);
          question.answers.forEach((answer) => {
            acc.push(answer.id);
          });
        }

        return acc;
      }, []);

      return result;
    } catch {
      dispatch(
        notify({
          text: translate('AdminEmails.errorInvalidData'),
          type: NotificationsTypes.ERROR,
        }),
      );

      return [];
    }
  }, [dispatch, selectedFestival]);

  const textareaToRecipients = (value) =>
    [
      ...value
        .split('\n')
        .filter((line) => line !== '')
        .reduce((memo, email) => memo.add(email), new Set()),
    ].sort();

  const recipientsToTextarea = (recipients, existing = []) =>
    [
      ...recipients
        .concat(existing)
        .reduce((memo, email) => memo.add(email), new Set()),
    ]
      .sort()
      .join('\n');

  const {
    Form,
    setValues,
    values,
    meta: { isValid },
  } = useRequestForm({
    requestId,
    schema,
    onSubmit: (values) => {
      if (festivalAnswerIds.length == 0) {
        return dispatch(
          notify({
            text: translate('AdminEmails.errorInvalidData'),
            type: NotificationsTypes.ERROR,
          }),
        );
      }

      dispatch(
        putRequest({
          id: requestId,
          path: ['tasks'],
          body: {
            kind: 'vote_invitations',
            data: textareaToRecipients(values.recipients).map((to, index) => {
              const nonce = index;
              const boothSignature = signBooth({
                festivalAnswerIds,
                privateKey,
                nonce,
              });
              return {
                to,
                booth: booth.address,
                boothSignature,
                festivalSlug: selectedFestival.slug,
                festivalAnswerIds,
                festivalQuestionId,
                nonce,
                organisationId: values.organisationId,
              };
            }),
          },
        }),
      );
    },
    onError: () => {
      dispatch(
        notify({
          text: translate('default.errorMessage'),
          type: NotificationsTypes.ERROR,
        }),
      );
    },
    onSuccess: () => {
      dispatch(resetBooth());
      dispatch(
        notify({
          text: translate('AdminEmails.notificationSuccess', {
            amount: textareaToRecipients(values.recipients).length,
          }),
        }),
      );
      history.push(returnUrl);
    },
  });

  const handleFileUpload = (contents) => {
    const emails = textareaToRecipients(contents).filter((line) => {
      try {
        Joi.assert(line, schema.recipients);
      } catch (e) {
        return false;
      }
      return true;
    });
    const recipients = textareaToRecipients(values.recipients);

    setValues({
      recipients: recipientsToTextarea(emails, recipients),
    });
  };

  const handleFileUploadError = () => {
    dispatch(
      notify({
        text: translate('default.errorMessage'),
        type: NotificationsTypes.ERROR,
      }),
    );
  };

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminEmails.title')}</HeaderAdmin>

      <ViewAdmin>
        <ContractsEmailSigner
          booth={booth}
          isReadyToSign={isReadyToSign}
          setFestival={setSelectedFestival}
        />
        <HelpCopyStyle>
          <ParagraphStyle>{translate('AdminEmails.copy')}</ParagraphStyle>
          <ParagraphStyle>{translate('AdminEmails.copyUpload')}</ParagraphStyle>
          <PreStyle>{translate('AdminEmails.example')}</PreStyle>
        </HelpCopyStyle>
        <Form>
          <InputFinderField
            isDisabled={!isReadyToSign}
            label={translate('AdminEmails.fieldOrganisationId')}
            name="organisationId"
            placeholder={translate('AdminEmails.fieldOrganisationPlaceholder')}
            queryPath={['organisations']}
            searchParam={'name'}
            selectParam={'id'}
            validate={organisationSchema}
          />
          <FormScheduleEmail disabled={!isReadyToSign} />

          <FileUpload
            accept={['text/plain', 'text/csv', 'text/x-csv']}
            disabled={!isReadyToSign}
            uploadText={translate('AdminEmails.fileUpload')}
            onError={handleFileUploadError}
            onUpload={handleFileUpload}
          />
          <ButtonSubmit disabled={!isValid && !isLoading} />
        </Form>
      </ViewAdmin>

      <FooterAdmin>
        <SpacingGroupStyle>
          <ButtonIcon isIconFlipped to="/admin">
            {translate('default.buttonReturnToDashboard')}
          </ButtonIcon>
        </SpacingGroupStyle>
      </FooterAdmin>
    </Fragment>
  );
};

export default AdminEmails;
