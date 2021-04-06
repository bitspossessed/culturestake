import Joi from 'joi';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import InputFinderField from '~/client/components/InputFinderField';
import InputHiddenField from '~/client/components/InputHiddenField';
import translate from '~/common/services/i18n';
import apiRequest from '~/client/services/api';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const FormAnswers = ({ question, festivalId, isDisabled }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.app);

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

  const createProperty = async (title) => {
    try {
      const response = await apiRequest({
        path: ['properties'],
        method: 'PUT',
        body: { title },
        token,
      });
      dispatch(
        notify({
          text: translate('FormAnswers.notificationPropertySuccess', {
            title: response.title,
          }),
        }),
      );
      return response;
    } catch (e) {
      dispatch(
        notify({
          text: translate('default.errorMessage'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  };

  const filter = (item) => {
    const filterParam =
      question.type === 'festival' ? 'artworkId' : 'propertyId';
    const answerIds = question.answers.map((answer) => answer[filterParam]);

    if (filterParam === 'artworkId') {
      const filtered = item.festivals.filter((festival) => {
        return festival.id === festivalId && !answerIds.includes(item.id);
      });
      return filtered.length >= 1;
    } else return !answerIds.includes(item.id);
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
          clientSideFilter={filter}
          isDisabled={isDisabled}
          label={translate('AdminAnswersNew.fieldProperty')}
          name="propertyId"
          placeholder={translate('AdminAnswersNew.fieldPropertyPlaceholder')}
          queryPath={['properties']}
          searchParam={'title'}
          validate={schema.propertyId}
          onCreateCallback={createProperty}
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
