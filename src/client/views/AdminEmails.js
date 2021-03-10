import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Joi from 'joi';

import ButtonIcon from '~/client/components/ButtonIcon';
import FileUpload from '~/client/components/FileUpload';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import ButtonSubmit from '~/client/components/ButtonSubmit';
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

const AdminEmails = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const requestId = useRequestId();

  const returnUrl = '/admin';

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
      dispatch(
        putRequest({
          id: requestId,
          path: ['tasks'],
          body: {
            kind: 'vote_invitations',
            data: textareaToRecipients(values.recipients).map((to) => ({ to })),
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
        <HelpCopyStyle>
          <ParagraphStyle>{translate('AdminEmails.copy')}</ParagraphStyle>
          <ParagraphStyle>{translate('AdminEmails.copyUpload')}</ParagraphStyle>
          <PreStyle>{translate('AdminEmails.example')}</PreStyle>
        </HelpCopyStyle>

        <Form>
          <FormScheduleEmail />

          <FileUpload
            accept={['text/plain', 'text/csv', 'text/x-csv']}
            uploadText={translate('AdminEmails.fileUpload')}
            onError={handleFileUploadError}
            onUpload={handleFileUpload}
          />
          <ButtonSubmit disabled={!isValid} />
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
