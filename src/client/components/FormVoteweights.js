import Joi from '@hapi/joi';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import InputField from '~/client/components/InputField';
import InputHiddenField from '~/client/components/InputHiddenField';
import { InputSelectField } from '~/client/components/InputSelectField';
import translate from '~/common/services/i18n';
import { web3Validators } from '~/common/helpers/validate';
import { VOTEWEIGHT_TYPES } from '~/common/helpers/validate';

const FormVoteweights = ({ festival }) => {
  const schema = {
    festivalId: Joi.number().integer().required(),
    strength: Joi.number().integer().required(),
    type: Joi.string()
      .valid(...VOTEWEIGHT_TYPES)
      .required(),
    longitude: Joi.alternatives.conditional('type', {
      is: 'location',
      then: Joi.number().required(),
      otherwise: Joi.any().valid(null),
    }),
    latitude: Joi.alternatives.conditional('type', {
      is: 'location',
      then: Joi.number().required(),
      otherwise: Joi.any().valid(null),
    }),
    radius: Joi.alternatives.conditional('type', {
      is: 'location',
      then: Joi.number().required(),
      otherwise: Joi.any().valid(null),
    }),
    organisationId: Joi.alternatives.conditional('type', {
      is: 'organisation',
      then: Joi.number().required(),
      otherwise: Joi.any().valid(null),
    }),
    hotspot: Joi.alternatives.conditional('type', {
      is: 'hotspot',
      then: web3Validators.web3().address().required(),
      otherwise: Joi.any().valid(null),
    }),
  };

  return (
    <Fragment>
      <InputHiddenField
        label={'festivalId'}
        name={'festivalId'}
        value={{ value: festival.id }}
      />

      <InputField
        label={translate('FormArtists.fieldName')}
        name="strength"
        type="text"
        validate={schema.strength}
      />

      <InputSelectField
        label={translate('FormArtists.fieldBio')}
        name="type"
        validate={schema.type}
      >
        {Object.values(VOTEWEIGHT_TYPES).map((value) => {
          return (
            <option key={value} value={value}>
              {value}
            </option>
          );
        })}
      </InputSelectField>

      <InputField
        label={translate('FormArtists.fieldName')}
        name="latitude"
        type="text"
        validate={schema.latitude}
      />

      <InputField
        label={translate('FormArtists.fieldName')}
        name="latitude"
        type="text"
        validate={schema.latitude}
      />

      <InputField
        label={translate('FormArtists.fieldName')}
        name="radius"
        type="text"
        validate={schema.radius}
      />

      <InputField
        label={translate('FormArtists.fieldName')}
        name="hotspot"
        type="text"
        validate={schema.hotspot}
      />
    </Fragment>
  );
};

FormVoteweights.propTypes = {
  festival: PropTypes.object.isRequired,
};

export default FormVoteweights;
