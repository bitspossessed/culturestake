import Joi from 'joi';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import InputField from '~/client/components/InputField';
import InputHiddenField from '~/client/components/InputHiddenField';
import InputSelectField from '~/client/components/InputSelectField';
import translate from '~/common/services/i18n';
import { web3Validators } from '~/common/helpers/validate';
import { VOTEWEIGHT_TYPES } from '~/common/helpers/validate';
import InputFinderField from '~/client/components/InputFinderField';

const FormVoteweights = ({
  festival,
  isDisabled = false,
  readOnly = false,
  type,
  onChange,
}) => {
  const schema = {
    festivalId: Joi.number().integer().required(),
    multiplier: Joi.number().min(0.01).required(),
    name: Joi.string().required(),
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
    organisationId: Joi.alternatives()
      .conditional('.type', {
        is: Joi.string().valid('organisation'),
        then: Joi.number().required(),
        otherwise: Joi.any().valid(null),
      })
      .error(new Error(translate('validations.organisationRequired'))),
    hotspot: Joi.alternatives().conditional('.type', {
      is: Joi.string().valid('hotspot'),
      then: web3Validators.web3().address().required(),
      otherwise: Joi.any().valid(null),
    }),
  };

  const filter = (item) => {
    const organisationIds = festival.voteweights.map((voteweight) => {
      if (voteweight.type === 'organisation') {
        return voteweight['organisationId'];
      }
    });
    return !organisationIds.includes(item.id);
  };

  return (
    <Fragment>
      <InputHiddenField
        label={'festivalId'}
        name={'festivalId'}
        value={{ value: festival.id }}
      />

      <InputField
        isDisabled={isDisabled}
        label={translate('FormVoteweights.fieldName')}
        name="name"
        readOnly={readOnly}
        type="text"
        validate={schema.name}
      />

      <InputField
        isDisabled={isDisabled}
        label={translate('FormVoteweights.fieldMultiplier')}
        name="multiplier"
        placeholder="eg. 1.00"
        readOnly={readOnly}
        type="text"
        validate={schema.multiplier}
      />

      <InputSelectField
        isDisabled={isDisabled}
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
            isDisabled={isDisabled}
            label={translate('FormVoteweights.fieldLatitude')}
            name="latitude"
            readOnly={readOnly}
            type="text"
            validate={schema.latitude}
          />

          <InputField
            allowNull={true}
            isDisabled={isDisabled}
            label={translate('FormVoteweights.fieldLongitude')}
            name="longitude"
            readOnly={readOnly}
            type="text"
            validate={schema.longitude}
          />

          <InputField
            allowNull={true}
            isDisabled={isDisabled}
            label={translate('FormVoteweights.fieldRadius')}
            name="radius"
            readOnly={readOnly}
            type="text"
            validate={schema.radius}
          />
        </Fragment>
      ) : null}

      {type === 'hotspot' ? (
        <InputField
          allowNull={true}
          isDisabled={isDisabled}
          label={translate('FormVoteweights.fieldHotspot')}
          name="hotspot"
          readOnly={readOnly}
          type="text"
          validate={schema.hotspot}
        />
      ) : null}

      {type === 'organisation' ? (
        <InputFinderField
          clientSideFilter={filter}
          isDisabled={isDisabled}
          label={translate('FormVoteweights.fieldOrganisation')}
          name="organisationId"
          placeholder={translate(
            'FormVoteweights.fieldOrganisationPlaceholder',
          )}
          queryPath={['organisations']}
          readOnly={readOnly}
          searchParam={'name'}
          selectParam={'id'}
          validate={schema.organisationId}
        />
      ) : null}
    </Fragment>
  );
};

FormVoteweights.propTypes = {
  festival: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  type: PropTypes.string,
};

export default FormVoteweights;
