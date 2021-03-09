import Joi from 'joi';
import React, { Fragment } from 'react';

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

const FormScheduleEmail = () => {
  return (
    <Fragment>
      <InputTextareaField
        label={translate('FormScheduleEmail.fieldRecipients')}
        name="recipients"
        rows={15}
        validate={schema.recipients}
      />
    </Fragment>
  );
};

export default FormScheduleEmail;
