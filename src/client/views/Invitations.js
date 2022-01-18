import Joi from 'joi';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import ButtonGroup from '~/client/components/ButtonGroup';
import ButtonIcon from '~/client/components/ButtonIcon';
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
import { useParams } from 'react-router-dom';

import { useRequestForm } from '~/client/hooks/forms';

const Invitations = () => {
  const dispatch = useDispatch();
  const requestId = useRequestId();
  const params = useParams();

  const schema = {
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    festivalSlug: Joi.string().required(),
  };

  const { Form } = useRequestForm({
    requestId,
    schema,
    onSubmit: (values) => {
      dispatch(
        putRequest({
          id: requestId,
          path: ['tasks'],
          body: {
            kind: 'vote',
            data: {
              ...values,
              ...params,
            },
          },
        }),
      );
    },
    onError: () => {
      dispatch(
        notify({
          text: translate('Invitations.errorMessage'),
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

        <ButtonGroup>
          <ButtonIcon
            href={
              'https://docs.google.com/document/d/1gzvD9XIg7-EhT5MZCFHiBuO9VGlPFUa0VAO7StpJAag/edit'
            }
          >
            {translate('Invitations.buttonFAQ')}
          </ButtonIcon>
        </ButtonGroup>
      </ViewAdmin>
    </Fragment>
  );
};

export default Invitations;
