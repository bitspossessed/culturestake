import Joi from 'joi';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';

import InputField from '~/client/components/InputField';

const FormUsers = ({ isPasswordHidden = false }) => {
  const schema = {
    username: Joi.string().alphanum().min(3).max(24).required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
  };

  if (!isPasswordHidden) {
    schema.password = Joi.string().min(8).max(128).required();
  }

  return (
    <Fragment>
      <InputField
        label={translate('FormUsers.fieldUsername')}
        name="username"
        type="text"
        validate={schema.username}
      />

      <InputField
        label={translate('FormUsers.fieldEmail')}
        name="email"
        type="email"
        validate={schema.email}
      />

      {!isPasswordHidden ? (
        <InputField
          label={translate('FormUsers.fieldPassword')}
          name="password"
          type="password"
          validate={schema.password}
        />
      ) : null}
    </Fragment>
  );
};

FormUsers.propTypes = {
  isPasswordHidden: PropTypes.bool,
};

export default FormUsers;
