import Joi from '@hapi/joi';
import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';
import InputField from '~/client/components/InputField';
// import Finder from '~/client/components/Finder';

const FormQuestions = () => {
  const schema = {
    title: Joi.string().max(128).required(),
    festivalId: Joi.number().integer().required(),
    artworkId: Joi.number().integer(),
    answers: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.number().positive(),
        }),
      )
      .max(10),
  };

  return (
    <Fragment>
      <InputField
        label={translate('FormQuestions.fieldTitle')}
        name="title"
        type="text"
        validate={schema.title}
      />
    </Fragment>
  );
};

export default FormQuestions;
