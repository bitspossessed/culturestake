import { Joi, Segments } from 'celebrate';

import { slugValidation, paginationValidation } from '~/server/validations';
import { types } from '~/server/models/answer';

const defaultValidation = Joi.alternatives().try(
  Joi.object().keys({
    type: Joi.string()
      .valid(types[0], types[1])
      .required(),
    artworkId: Joi.any().valid(null),
    propertyId: Joi.number().integer(),
  }),
  Joi.object().keys({
    type: Joi.string()
      .valid(types[0], types[1])
      .required(),
    artworkId: Joi.number().integer(),
    propertyId: Joi.any().valid(null),
  }),
);

export default {
  create: {
    [Segments.BODY]: defaultValidation,
  },
  readAll: {
    [Segments.PARAMS]: {
      ...paginationValidation,
      orderKey: Joi.string().valid('id', 'createdAt', 'updatedAt', 'title'),
    },
  },
  read: {
    [Segments.PARAMS]: {
      ...slugValidation,
    },
  },
  destroy: {
    [Segments.PARAMS]: {
      ...slugValidation,
    },
  },
};
