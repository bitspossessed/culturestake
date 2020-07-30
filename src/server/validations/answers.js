import { Joi, Segments } from 'celebrate';

import { idValidation, paginationValidation } from '~/server/validations';

export const defaultValidation = Joi.alternatives().try(
  Joi.object().keys({
    artworkId: Joi.any().valid(null),
    propertyId: Joi.number().integer(),
    questionId: Joi.number().integer().required(),
  }),
  Joi.object().keys({
    artworkId: Joi.number().integer(),
    propertyId: Joi.any().valid(null),
    questionId: Joi.number().integer().required(),
  }),
);

export default {
  create: {
    [Segments.BODY]: defaultValidation,
  },
  readAll: {
    [Segments.PARAMS]: {
      ...paginationValidation,
      orderKey: Joi.string().valid('id', 'createdAt', 'updatedAt', 'type'),
    },
  },
  read: {
    [Segments.PARAMS]: {
      ...idValidation,
    },
  },
  destroy: {
    [Segments.PARAMS]: {
      ...idValidation,
    },
  },
};
