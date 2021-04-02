import Joi from 'joi';
import React, { Fragment } from 'react';

import InputField from '~/client/components/InputField';
import InputTextareaField from '~/client/components/InputTextareaField';
import InputUploadField from '~/client/components/InputUploadField';
import translate from '~/common/services/i18n';
import { imagesValidation } from '~/common/helpers/validate';

const FormOrganisations = () => {
  const schema = {
    description: Joi.string().max(2000).required(),
    name: Joi.string().max(128).required(),
    images: imagesValidation.required().max(1),
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

      <InputUploadField
        isImageUpload
        label={translate('FormOrganisations.fieldImages')}
        name="images"
        validate={schema.images}
      />
    </Fragment>
  );
};

export default FormOrganisations;
