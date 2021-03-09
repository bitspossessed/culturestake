import Joi from 'joi';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import InputField from '~/client/components/InputField';
import InputFinderField from '~/client/components/InputFinderField';
import translate from '~/common/services/i18n';

const FormQuestions = ({ isFinderDisabled, festivalId }) => {
  const hasFestival = !!festivalId;
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

  const filter = (item) => {
    const filtered = item.festivals.filter(
      (festival) => festival.id === festivalId,
    );

    return filtered.length >= 1;
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
        clientSideFilter={filter}
        isDisabled={isFinderDisabled || !hasFestival}
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
  festivalId: PropTypes.number,
  isFinderDisabled: PropTypes.bool,
};

export default FormQuestions;
