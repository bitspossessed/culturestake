import Joi from 'joi';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import InputFinderField from '~/client/components/InputFinderField';
import InputHiddenField from '~/client/components/InputHiddenField';
import translate from '~/common/services/i18n';

const FormAnswers = ({ question, festivalId, isDisabled }) => {
  const schema = {};
  if (question.type === 'festival') {
    schema.artworkId = Joi.number()
      .required()
      .error(new Error(translate('validations.artworkRequired')));
  } else {
    schema.propertyId = Joi.number()
      .required()
      .error(new Error(translate('validations.artworkRequired')));
  }

  const filter = (item) => {
    const filterParam =
      question.type === 'festival' ? 'artworkId' : 'propertyId';
    const answerIds = question.answers.map((answer) => answer[filterParam]);
    const filtered = item.festivals.filter((festival) => {
      return festival.id === festivalId && !answerIds.includes(item.id);
    });
    return filtered.length >= 1;
  };

  return (
    <Fragment>
      <InputHiddenField
        label={'questionId'}
        name={'questionId'}
        value={{ value: question.id }}
      />

      {question.type === 'festival' ? (
        <InputFinderField
          clientSideFilter={filter}
          isDisabled={isDisabled}
          label={translate('AdminAnswersNew.fieldArtwork')}
          name="artworkId"
          placeholder={translate('AdminAnswersNew.fieldArtworkPlaceholder')}
          queryPath={['artworks']}
          searchParam={'title'}
          validate={schema.artworkId}
        />
      ) : (
        <InputFinderField
          isDisabled={isDisabled}
          label={translate('AdminAnswersNew.fieldProperty')}
          name="propertyId"
          placeholder={translate('AdminAnswersNew.fieldPropertyPlaceholder')}
          queryPath={['properties']}
          searchParam={'title'}
          validate={schema.propertyId}
        />
      )}
    </Fragment>
  );
};

FormAnswers.propTypes = {
  festivalId: PropTypes.number,
  isDisabled: PropTypes.bool,
  question: PropTypes.object.isRequired,
};
export default FormAnswers;
