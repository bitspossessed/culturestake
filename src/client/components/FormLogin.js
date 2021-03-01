import Joi from 'joi';
import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';

import InputField from '~/client/components/InputField';

const schema = {
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().required(),
};

const FormLogin = () => {
  return (
    <Fragment>
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
    </Fragment>
  );
};

export default FormLogin;
