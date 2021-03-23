import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import ButtonSubmit from '~/client/components/ButtonSubmit';
import FormInvitations from '~/client/components/FormInvitations';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import { HorizontalSpacingStyle } from '~/client/styles/layout';
import { ParagraphStyle } from '~/client/styles/typography';
import translate from '~/common/services/i18n';
import { useRequestId } from '~/client/hooks/requests';
import { putRequest } from '~/client/store/api/actions';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
//import { useParams } from 'react-router-dom';

import { useRequestForm } from '~/client/hooks/forms';

const Invitations = () => {
  const dispatch = useDispatch();
  const requestId = useRequestId();
  //const params = useParams();

  const { Form, values } = useRequestForm({
    onSubmit: () => {
      dispatch(
        putRequest({
          id: requestId,
          path: ['tasks'],
          body: {
            kind: 'vote',
            data: values,
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
          text: translate('Invitations.notificationSuccess'),
        }),
      );
    },
  });

  return (
    <Fragment>
      <HeaderAdmin>{translate('Invitations.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormInvitations />
          <HorizontalSpacingStyle />
          <ParagraphStyle>
            {translate('Invitations.locationDescription')}
          </ParagraphStyle>
          <HorizontalSpacingStyle />
          <ButtonSubmit>{translate('Invitations.buttonSubmit')}</ButtonSubmit>
        </Form>
      </ViewAdmin>
    </Fragment>
  );
};

export default Invitations;
