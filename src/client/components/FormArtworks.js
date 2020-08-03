import Joi from '@hapi/joi';
import React, { Fragment } from 'react';

import InputField from '~/client/components/InputField';
import InputFinderField from '~/client/components/InputFinderField';
import InputStickerField from '~/client/components/InputStickerField';
import InputTextareaField from '~/client/components/InputTextareaField';
import InputUploadField from '~/client/components/InputUploadField';
import translate from '~/common/services/i18n';
import { imagesValidation, stickerValidation } from '~/common/helpers/validate';

const FormArtworks = () => {
  const schema = {
    artistId: Joi.number()
      .required()
      .error(new Error(translate('validations.artistRequired'))),
    description: Joi.string().max(2000).required(),
    images: imagesValidation.required().max(10),
    sticker: stickerValidation.required(),
    title: Joi.string().max(128).required(),
    url: Joi.string().uri(),
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

      <InputField
        label={translate('FormArtworks.fieldUrl')}
        name="url"
        type="text"
        validate={schema.url}
      />

      <InputFinderField
        label={translate('FormArtworks.fieldArtist')}
        name="artistId"
        placeholder={translate('FormArtworks.fieldArtistPlaceholder')}
        queryPath={['artists']}
        searchParam="name"
        validate={schema.artistId}
      />

      <InputUploadField
        isImageUpload
        isMultipleFilesAllowed
        label={translate('FormArtworks.fieldImages')}
        name="images"
        validate={schema.images}
      />

      <InputStickerField
        label={translate('FormArtworks.fieldSticker')}
        name="sticker"
        validate={schema.sticker}
      />
    </Fragment>
  );
};

export default FormArtworks;
