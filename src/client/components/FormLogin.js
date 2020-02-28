import Joi from '@hapi/joi';
import React from 'react';
import { useDispatch } from 'react-redux';

import translate from '~/common/services/i18n';

import ButtonSubmit from '~/client/components/ButtonSubmit';
import InputField from '~/client/components/InputField';
import { requestToken, TOKEN_REQUEST_ID } from '~/client/store/app/actions';
import { useForm } from '~/client/hooks/forms';

import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const schema = {
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().required(),
};

// eslint-disable-next-line react/display-name
const FormLogin = () => {
  const dispatch = useDispatch();

  const {
    Form,
    meta: {
      canSubmit,
      request: { isPending },
    },
  } = useForm({
    requestId: TOKEN_REQUEST_ID,
    onSubmit: ({ email, password }) => {
      dispatch(requestToken(email, password));
    },
  });

  return (
    <Form>
      <InputField
        label={translate('FormLogin.fieldEmail')}
        name="email"
        type="email"
        validate={schema.email}
      />

      <InputField
        label={translate('FormLogin.fieldPassword')}
        name="password"
        type="password"
        validate={schema.password}
      />

      <ButtonSubmit disabled={!canSubmit} isPending={isPending}>
        {translate('FormLogin.buttonSubmit')}
      </ButtonSubmit>
    </Form>
  );
};

export default FormLogin;
