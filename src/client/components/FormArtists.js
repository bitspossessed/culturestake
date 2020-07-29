import Joi from '@hapi/joi';
import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';
import InputField from '~/client/components/InputField';
import { imagesValidation } from '~/common/helpers/validate';
import InputTextareaField from '~/client/components/InputTextareaField';
import InputCheckboxField from '~/client/components/InputCheckboxField';
import InputUploadField from '~/client/components/InputUploadField';

const FormArtists = () => {
  const schema = {
    name: Joi.string().max(128).required(),
    bio: Joi.string().max(2000).required(),
    consentToDataReveal: Joi.boolean(),
    images: imagesValidation.max(2),
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

      <InputCheckboxField
        label={translate('FormArtists.fieldConsentToDataReveal')}
        name="consent to data reveal"
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
