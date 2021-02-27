import Joi from '@hapi/joi';
import React, { Fragment } from 'react';

import InputField from '~/client/components/InputField';
import InputTextareaField from '~/client/components/InputTextareaField';
import translate from '~/common/services/i18n';

const FormOrganisations = () => {
  const schema = {
    description: Joi.string().max(2000).required(),
    name: Joi.string().max(128).required(),
  };

  return (
    <Fragment>
      <InputField
        label={translate('FormOrganisations.fieldName')}
        name="name"
        type="text"
        validate={schema.name}
      />

      <InputTextareaField
        label={translate('FormOrganisations.fieldDescription')}
        name="description"
        validate={schema.description}
      />
    </Fragment>
  );
};

export default FormOrganisations;
