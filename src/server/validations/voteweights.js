import { Joi, Segments } from 'celebrate';

import { idValidation, paginationValidation } from '~/server/validations';
import { web3Validators } from '~/common/helpers/validate';

const defaultValidation = Joi.alternatives().try(
  Joi.object().keys({
    festivalId: Joi.number().integer().required(),
    strength: Joi.number().integer().required(),
    type: Joi.string().valid('hotspot').required(),
    location: Joi.any().valid(null),
    radius: Joi.any().valid(null),
    organisationId: Joi.any().valid(null),
    hotspot: web3Validators.web3().address().required(),
  }),
  Joi.object().keys({
    festivalId: Joi.number().integer().required(),
    strength: Joi.number().integer().required(),
    type: Joi.string().valid('location').required(),
    location: Joi.object()
      .keys({
        latitude: Joi.number().min(-90).max(90),
        longitude: Joi.number().min(-180).max(180),
      })
      .required(),
    radius: Joi.number().required(),
    organisationId: Joi.any().valid(null),
    hotspot: Joi.any().valid(null),
  }),
);

export default {
  create: {
    [Segments.BODY]: defaultValidation,
  },
  readAll: {
    [Segments.PARAMS]: {
      ...paginationValidation,
      orderKey: Joi.string().valid('id', 'createdAt', 'updatedAt'),
    },
  },
  read: {
    [Segments.PARAMS]: {
      ...idValidation,
    },
  },
  update: {
    [Segments.PARAMS]: {
      ...idValidation,
    },
    [Segments.BODY]: defaultValidation,
  },
  destroy: {
    [Segments.PARAMS]: {
      ...idValidation,
    },
  },
};
