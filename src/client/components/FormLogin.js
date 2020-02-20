import Joi from '@hapi/joi';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ButtonSubmit from '~/client/components/ButtonSubmit';
import InputField from '~/client/components/InputField';
import { requestToken, TOKEN_REQUEST_ID } from '~/client/store/app/actions';
import { useForm } from '~/client/hooks/forms';

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
      request: { isPending, isSuccess },
    },
  } = useForm({
    requestId: TOKEN_REQUEST_ID,
    onSubmit: ({ email, password }) => {
      dispatch(requestToken(email, password));
    },
    onError: error => {
      // @TODO: Show Flash component message instead
      alert(error.message);
    },
  });

  if (isSuccess) {
    return <Redirect to="/admin" />;
  }

  return (
    <Form>
      <InputField
        label="Your E-Mail-Address"
        name="email"
        type="email"
        validate={schema.email}
      />

      <InputField
        label="Your password"
        name="password"
        type="password"
        validate={schema.password}
      />

      <ButtonSubmit disabled={!canSubmit} isPending={isPending}>
        Login
      </ButtonSubmit>
    </Form>
  );
};

export default FormLogin;
