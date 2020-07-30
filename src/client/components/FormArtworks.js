import Joi from '@hapi/joi';
import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';
import InputField from '~/client/components/InputField';
import { imagesValidation } from '~/common/helpers/validate';
import InputTextareaField from '~/client/components/InputTextareaField';
import InputUploadField from '~/client/components/InputUploadField';

const FormArtworks = () => {
  const schema = {
    title: Joi.string().max(128).required(),
    description: Joi.string().required(),
    images: imagesValidation.required().max(10),
  };

  return (
    <Fragment>
      <InputField
        label={translate('FormArtworks.fieldTitle')}
        name="title"
        type="text"
        validate={schema.title}
      />

      <InputTextareaField
        label={translate('FormArtworks.fieldDescription')}
        name="description"
        validate={schema.description}
      />

      <InputUploadField
        isImageUpload
        isMultipleFilesAllowed
        label={translate('FormArtworks.fieldImages')}
        name="images"
        validate={schema.images}
      />
    </Fragment>
  );
};

export default FormArtworks;
