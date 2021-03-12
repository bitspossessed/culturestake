import Joi from 'joi';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import InputArtworksField from '~/client/components/InputArtworksField';
import InputCheckboxField from '~/client/components/InputCheckboxField';
import InputField from '~/client/components/InputField';
import InputHiddenField from '~/client/components/InputHiddenField';
import InputStickerField from '~/client/components/InputStickerField';
import InputTextareaField from '~/client/components/InputTextareaField';
import InputUploadField from '~/client/components/InputUploadField';
import translate from '~/common/services/i18n';
import {
  documentsValidation,
  imagesValidation,
  stickerValidation,
} from '~/common/helpers/validate';

const FormFestivals = () => {
  const schema = {
    artworks: Joi.array().required().max(30),
    description: Joi.string().max(2000).required(),
    documents: documentsValidation.max(3),
    images: imagesValidation.max(10),
    online: Joi.boolean().falsy(''),
    sticker: stickerValidation.required(),
    subtitle: Joi.string().max(255).required(),
    title: Joi.string().max(128).required(),
    url: Joi.string().uri().allow(''),
    question: {
      title: Joi.string().max(128).required(),
      type: Joi.valid('festival').required(),
    },
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

      <InputField
        label={translate('FormFestivals.fieldUrl')}
        name="url"
        type="text"
        validate={schema.url}
      />

      <InputTextareaField
        label={translate('FormFestivals.fieldDescription')}
        name="description"
        validate={schema.description}
      />

      <InputField
        label={translate('FormFestivals.fieldQuestion')}
        name="question.title"
        type="text"
        validate={schema.question.title}
      />

      <InputHiddenField
        label={translate('FormFestivals.fieldQuestion')}
        name="question.type"
        type="text"
        value={{ value: 'festival' }}
        validate={schema.question.type}
      />

      <InputCheckboxField
        label={translate('FormFestivals.fieldOnline')}
        name="online"
        validate={schema.online}
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

      <InputArtworksField
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
