import Joi from '@hapi/joi';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';
import {
  imagesValidation,
  documentsValidation,
} from '~/common/helpers/validate';
import InputField from '~/client/components/InputField';
import InputUploadField from '~/client/components/InputUploadField';
import InputTextareaField from '~/client/components/InputTextareaField';

const FormFestivals = () => {
  const schema = {
    artworks: Joi.array().required(),
    description: Joi.string().required(),
    documents: documentsValidation.required().max(1),
    images: imagesValidation.required().max(10),
    title: Joi.string().max(128).required(),
  };

  return (
    <Fragment>
      <InputField
        label={translate('FormFestivals.fieldTitle')}
        name="title"
        type="text"
        validate={schema.title}
      />

      <InputTextareaField
        label={translate('FormFestivals.fieldDescription')}
        name="description"
        validate={schema.description}
      />

      <InputUploadField
        isImageUpload
        isMultipleFilesAllowed
        label={translate('FormFestivals.fieldImages')}
        name="images"
        validate={schema.images}
      />

      <InputUploadField
        isImageUpload={false}
        label={translate('FormFestivals.fieldDocuments')}
        maxFileCount={1}
        name="documents"
        validate={schema.documents}
      />

      <InputUploadField
        label={translate('FormFestivals.fieldArtworks')}
        name="artworks"
        validate={schema.artworks}
      />
    </Fragment>
  );
};

FormFestivals.propTypes = {
  isPasswordHidden: PropTypes.bool,
};

export default FormFestivals;
