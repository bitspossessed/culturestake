import Joi from 'joi';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import InputField from '~/client/components/InputField';
import InputHiddenField from '~/client/components/InputHiddenField';
import InputSelectField from '~/client/components/InputSelectField';
import translate from '~/common/services/i18n';
import { web3Validators } from '~/common/helpers/validate';
import { VOTEWEIGHT_TYPES } from '~/common/helpers/validate';

const FormVoteweights = ({ festival, type, onChange }) => {
  const schema = {
    festivalId: Joi.number().integer().required(),
    strength: Joi.number().integer().required(),
    type: Joi.string()
      .valid(...VOTEWEIGHT_TYPES)
      .required(),
    longitude: Joi.alternatives().conditional('.type', {
      is: Joi.string().valid('location'),
      then: Joi.number().required(),
      otherwise: Joi.any().valid(null),
    }),
    latitude: Joi.alternatives().conditional('.type', {
      is: Joi.string().valid('location'),
      then: Joi.number().required(),
      otherwise: Joi.any().valid(null),
    }),
    radius: Joi.alternatives().conditional('.type', {
      is: Joi.string().valid('location'),
      then: Joi.number().required(),
      otherwise: Joi.any().valid(null),
    }),
    organisationId: Joi.alternatives().conditional('.type', {
      is: Joi.string().valid('organisation'),
      then: Joi.number().required(),
      otherwise: Joi.any().valid(null),
    }),
    hotspot: Joi.alternatives().conditional('.type', {
      is: Joi.string().valid('hotspot'),
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
        label={translate('FormVoteweights.fieldStrength')}
        name="strength"
        type="text"
        validate={schema.strength}
      />

      <InputSelectField
        label={translate('FormVoteweights.fieldType')}
        name="type"
        validate={schema.type}
        onChange={onChange}
      >
        <option disabled value="" />
        {Object.values(VOTEWEIGHT_TYPES).map((value) => {
          return (
            <option key={value} value={value}>
              {value}
            </option>
          );
        })}
      </InputSelectField>

      {type === 'location' ? (
        <Fragment>
          <InputField
            allowNull={true}
            label={translate('FormVoteweights.fieldLatitude')}
            name="latitude"
            type="text"
            validate={schema.latitude}
          />

          <InputField
            allowNull={true}
            label={translate('FormVoteweights.fieldLongitude')}
            name="longitude"
            type="text"
            validate={schema.longitude}
          />

          <InputField
            allowNull={true}
            label={translate('FormVoteweights.fieldRadius')}
            name="radius"
            type="text"
            validate={schema.radius}
          />
        </Fragment>
      ) : null}

      {type === 'hotspot' ? (
        <InputField
          allowNull={true}
          label={translate('FormVoteweights.fieldHotspot')}
          name="hotspot"
          type="text"
          validate={schema.hotspot}
        />
      ) : null}
    </Fragment>
  );
};

FormVoteweights.propTypes = {
  festival: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  type: PropTypes.string,
};

export default FormVoteweights;
