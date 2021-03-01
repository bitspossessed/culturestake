import Joi from 'joi';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import InputField from '~/client/components/InputField';
import InputFinderField from '~/client/components/InputFinderField';
import translate from '~/common/services/i18n';

const FormQuestions = ({ isFinderDisabled }) => {
  const schema = {
    title: Joi.string().max(128).required(),
    festivalId: Joi.number()
      .integer()
      .required()
      .error(new Error(translate('validations.festivalRequired'))),
    artworkId: Joi.number()
      .integer()
      .allow(null)
      .error(new Error(translate('validations.artworkRequired'))),
  };

  return (
    <Fragment>
      <InputField
        label={translate('FormQuestions.fieldTitle')}
        name="title"
        type="text"
        validate={schema.title}
      />

      <InputFinderField
        isDisabled={isFinderDisabled}
        label={translate('FormQuestions.fieldFestival')}
        name="festivalId"
        placeholder={translate('FormQuestions.fieldFestivalPlaceholder')}
        queryPath={['festivals']}
        searchParam={'title'}
        validate={schema.festivalId}
      />

      <InputFinderField
        isDisabled={isFinderDisabled}
        label={translate('FormQuestions.fieldArtwork')}
        name="artworkId"
        placeholder={translate('FormQuestions.fieldArtworkPlaceholder')}
        queryPath={['artworks']}
        searchParam={'title'}
        selectParam={'id'}
        validate={schema.artworkId}
      />
    </Fragment>
  );
};

FormQuestions.propTypes = {
  isFinderDisabled: PropTypes.bool,
};

export default FormQuestions;
