import { Joi, Segments } from 'celebrate';

import { idValidation, paginationValidation } from '~/server/validations';
import { QUESTION_TYPES } from '~/common/helpers/validate';

const defaultValidation = {
  artworkId: Joi.number().integer().allow(null),
  festivalId: Joi.number().integer().required(),
  title: Joi.string().max(128).required(),
};

const createValidation = {
  ...defaultValidation,
  type: Joi.alternatives()
    .conditional('artworkId', {
      is: undefined,
      then: Joi.custom(() => 'festival'),
      otherwise: Joi.custom(() => 'artwork'),
    })
    .valid(...QUESTION_TYPES)
    .required(),
};

export default {
  create: {
    [Segments.BODY]: {
      ...createValidation,
    },
  },
  readAll: {
    [Segments.PARAMS]: {
      ...paginationValidation,
      orderKey: Joi.string().valid('id', 'createdAt', 'updatedAt', 'title'),
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
