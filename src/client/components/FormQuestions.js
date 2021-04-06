import Joi from 'joi';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import InputField from '~/client/components/InputField';
import InputHiddenField from '~/client/components/InputHiddenField';
import InputFinderField from '~/client/components/InputFinderField';
import translate from '~/common/services/i18n';
import { QUESTION_TYPES } from '~/common/helpers/validate';

const FormQuestions = ({
  festivalId,
  isFestivalDisabled = false,
  isArtworkDisabled = false,
  showFestivalFinder = true,
  showArtworkFinder = true,
}) => {
  const schema = {
    title: Joi.string().max(128).required(),
    festivalId: Joi.number()
      .integer()
      .required()
      .error(new Error(translate('validations.festivalRequired'))),
    artworkId: showArtworkFinder
      ? Joi.number()
          .integer()
          .required()
          .error(new Error(translate('validations.artworkRequired')))
      : Joi.number().integer().allow(null),
    // the question type is set by the caller of FormQuestions
    type: Joi.valid(...QUESTION_TYPES).required(),
  };

  const hasFestival = !!festivalId;

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

      {showFestivalFinder ? (
        <InputFinderField
          isDisabled={isFestivalDisabled}
          label={translate('FormQuestions.fieldFestival')}
          name="festivalId"
          placeholder={translate('FormQuestions.fieldFestivalPlaceholder')}
          queryPath={['festivals']}
          searchParam={'title'}
          validate={schema.festivalId}
        />
      ) : (
        <InputHiddenField name="festivalId" value={{ value: festivalId }} />
      )}

      {showArtworkFinder && (
        <InputFinderField
          clientSideFilter={filter}
          isDisabled={!hasFestival || isArtworkDisabled}
          label={translate('FormQuestions.fieldArtwork')}
          name="artworkId"
          placeholder={translate('FormQuestions.fieldArtworkPlaceholder')}
          queryPath={['artworks']}
          searchParam={'title'}
          selectParam={'id'}
          validate={schema.artworkId}
        />
      )}
    </Fragment>
  );
};

FormQuestions.propTypes = {
  festivalId: PropTypes.number,
  isArtworkDisabled: PropTypes.bool,
  isFestivalDisabled: PropTypes.bool,
  showArtworkFinder: PropTypes.bool,
  showFestivalFinder: PropTypes.bool,
};

export default FormQuestions;
