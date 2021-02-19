import Joi from 'joi';
import React, { Fragment } from 'react';

import InputCheckboxField from '~/client/components/InputCheckboxField';
import InputField from '~/client/components/InputField';
import InputTextareaField from '~/client/components/InputTextareaField';
import InputUploadField from '~/client/components/InputUploadField';
import translate from '~/common/services/i18n';
import { imagesValidation } from '~/common/helpers/validate';

const FormArtists = () => {
  const schema = {
    bio: Joi.string().max(2000).required(),
    consentToDataReveal: Joi.boolean()
      .valid(true)
      .required()
      .error(new Error(translate('validations.consentRequired'))),
    images: imagesValidation.max(3),
    name: Joi.string().max(128).required(),
    url: Joi.string().uri().allow(''),
  };

  return (
    <Fragment>
      <InputField
        label={translate('FormArtists.fieldName')}
        name="name"
        type="text"
        validate={schema.name}
      />

      <InputTextareaField
        label={translate('FormArtists.fieldBio')}
        name="bio"
        validate={schema.bio}
      />

      <InputField
        label={translate('FormArtists.fieldUrl')}
        name="url"
        type="text"
        validate={schema.url}
      />

      <InputCheckboxField
        label={translate('FormArtists.fieldConsentToDataReveal')}
        name="consentToDataReveal"
        validate={schema.consentToDataReveal}
      />

      <InputUploadField
        isImageUpload
        isMultipleFilesAllowed
        label={translate('FormArtists.fieldImages')}
        name="images"
        validate={schema.images}
      />
    </Fragment>
  );
};

export default FormArtists;
