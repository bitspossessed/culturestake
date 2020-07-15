import Joi from '@hapi/joi';
import React, { Fragment, useState } from 'react';

import translate from '~/common/services/i18n';
import InputField from '~/client/components/InputField';
import Finder from '~/client/components/Finder';

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

  const [festival, setFestival] = useState({});

  const onInputChange = (value) => {
    console.log('onInputChange in forms questions'); // eslint-disable-line
    console.log(value); // eslint-disable-line
    setFestival(value);
  };

  const onSelect = (value) => {
    // console.log('onInputChange in forms questions'); // eslint-disable-line
    // console.log(value); // eslint-disable-line
    setFestival(value);
  };

  return (
    <Fragment>
      <InputField
        label={translate('FormQuestions.fieldTitle')}
        name="title"
        type="text"
        validate={schema.title}
      />

      <Finder
        id={festival.id ? festival.id : 0}
        input={''}
        label={translate('FormQuestions.fieldFestival')}
        name="festival Id"
        queryPath={'festivals'}
        type="text"
        validate={schema.festivalId}
        value={''}
        onInputChange={onInputChange}
        onSelect={onSelect}
      />
    </Fragment>
  );
};

export default FormQuestions;
