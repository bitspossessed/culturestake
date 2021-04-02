import { Joi, Segments } from 'celebrate';

import { imagesValidation } from '~/common/helpers/validate';
import {
  paginationValidation,
  queryValidation,
  slugValidation,
} from '~/server/validations';

const defaultValidation = {
  description: Joi.string().max(2000).required(),
  images: imagesValidation.max(1),
  name: Joi.string().max(128).required(),
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
      ...queryValidation,
      orderKey: Joi.string().valid('id', 'createdAt', 'updatedAt', 'name'),
    },
  },
  read: {
    [Segments.PARAMS]: {
      ...slugValidation,
    },
  },
  update: {
    [Segments.PARAMS]: {
      ...slugValidation,
    },
    [Segments.BODY]: {
      ...defaultValidation,
    },
  },
  destroy: {
    [Segments.PARAMS]: {
      ...slugValidation,
    },
  },
};
