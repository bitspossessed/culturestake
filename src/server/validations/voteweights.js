import { Joi, Segments } from 'celebrate';

import { idValidation, paginationValidation } from '~/server/validations';
import { VOTEWEIGHT_TYPES } from '~/server/models/voteweight'

const defaultValidation = {
  festivalId: Joi.number().integer().required(),
  strength: Joi.number().integer().required(),
  type: Joi.string().valid(...VOTEWEIGHT_TYPES).required(),
  location: Joi.object().keys({
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
  }).allow(null),
  radius: Joi.number().allow(null),
  organisationId: Joi.number().integer().allow(null),
  hotspot: Joi.string().max(42).allow(null),
};

export default {
  create: {
    [Segments.BODY]: {
      ...defaultValidation,
    },
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
    [Segments.BODY]: {
      ...defaultValidation,
    },
  },
  destroy: {
    [Segments.PARAMS]: {
      ...idValidation,
    },
  },
};
