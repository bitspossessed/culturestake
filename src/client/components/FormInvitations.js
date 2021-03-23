import Joi from 'joi';
import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';

import InputField from '~/client/components/InputField';

const schema = {
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
};

const FormInvitations = () => {
  return (
    <Fragment>
      <InputField
        label={translate('FormInvitations.fieldEmail')}
        name="email"
        type="email"
        validate={schema.email}
      />
    </Fragment>
  );
};

export default FormInvitations;
