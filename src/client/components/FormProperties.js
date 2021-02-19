import Joi from 'joi';
import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';
import InputField from '~/client/components/InputField';

const FormProperties = () => {
  const schema = {
    title: Joi.string().max(128).required(),
  };

  return (
    <Fragment>
      <InputField
        label={translate('FormProperties.fieldTitle')}
        name="title"
        type="text"
        validate={schema.title}
      />
    </Fragment>
  );
};

export default FormProperties;
