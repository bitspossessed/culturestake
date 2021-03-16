import Joi from 'joi';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import InputTextareaField from '~/client/components/InputTextareaField';
import translate from '~/common/services/i18n';

export const schema = {
  recipients: Joi.string()
    .trim()
    .lowercase()
    // Top-Level domains are not available in the browser build of Joi.
    .email({ multiple: true, separator: '\n', tlds: { allow: false } })
    .required(),
};

const FormScheduleEmail = ({ disabled = false }) => {
  return (
    <Fragment>
      <InputTextareaField
        disabled={disabled}
        label={translate('FormScheduleEmail.fieldRecipients')}
        name="recipients"
        rows={15}
        validate={schema.recipients}
      />
    </Fragment>
  );
};

FormScheduleEmail.propTypes = {
  disabled: PropTypes.bool,
};

export default FormScheduleEmail;
