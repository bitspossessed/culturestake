import Joi from 'joi';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import InputArtworksField from '~/client/components/InputArtworksField';
import InputField from '~/client/components/InputField';
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
    sticker: stickerValidation.required(),
    subtitle: Joi.string().max(255).required(),
    title: Joi.string().max(128).required(),
    url: Joi.string().uri().allow(''),
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
