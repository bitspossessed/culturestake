import Joi from '@hapi/joi';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';
import {
  documentsValidation,
  imagesValidation,
  stickerValidation,
} from '~/common/helpers/validate';
import InputField from '~/client/components/InputField';
import InputStickerField from '~/client/components/InputStickerField';
import InputTextareaField from '~/client/components/InputTextareaField';
import InputUploadField from '~/client/components/InputUploadField';

const FormFestivals = () => {
  const schema = {
    artworks: Joi.array().required(),
    description: Joi.string().required(),
    documents: documentsValidation.required().max(1),
    images: imagesValidation.required().max(10),
    subtitle: Joi.string().max(255).required(),
    title: Joi.string().max(128).required(),
    sticker: stickerValidation.required(),
  };

  return (
    <Fragment>
      <InputField
        label={translate('FormFestivals.fieldTitle')}
        name="title"
        type="text"
        validate={schema.title}
      />

      <InputField
        label={translate('FormFestivals.fieldSubtitle')}
        name="subtitle"
        type="text"
        validate={schema.subtitle}
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

      <InputStickerField
        label={translate('FormFestivals.fieldSticker')}
        name="sticker"
        validate={schema.sticker}
      />
    </Fragment>
  );
};

FormFestivals.propTypes = {
  isPasswordHidden: PropTypes.bool,
};

export default FormFestivals;
