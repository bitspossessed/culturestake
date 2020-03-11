import Joi from '@hapi/joi';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';
import { imageValidator } from '~/common/helpers/validate';

import InputField from '~/client/components/InputField';
import InputUploadField from '~/client/components/InputUploadField';
import InputTextareaField from '~/client/components/InputTextareaField';

const MAX_FILE_COUNT = 10;

const FormFestivals = () => {
  const schema = {
    title: Joi.string()
      .max(128)
      .required(),
    description: Joi.string().required(),
    images: imageValidator.max(MAX_FILE_COUNT),
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
        label={translate('FormFestivals.fieldImages')}
        maxFileCount={MAX_FILE_COUNT}
        name="images"
        validate={schema.images}
      />
    </Fragment>
  );
};

FormFestivals.propTypes = {
  isPasswordHidden: PropTypes.bool,
};

export default FormFestivals;
