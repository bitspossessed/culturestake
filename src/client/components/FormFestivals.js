import Joi from '@hapi/joi';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';

import InputField from '~/client/components/InputField';
import InputTextareaField from '~/client/components/InputTextareaField';

const FormFestivals = () => {
  const schema = {
    title: Joi.string()
      .max(128)
      .required(),
    description: Joi.string().required(),
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
    </Fragment>
  );
};

FormFestivals.propTypes = {
  isPasswordHidden: PropTypes.bool,
};

export default FormFestivals;
