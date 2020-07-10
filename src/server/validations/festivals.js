import { Joi, Segments } from 'celebrate';

import {
  imagesValidation,
  documentsValidation,
} from '~/common/helpers/validate';
import { slugValidation, paginationValidation } from '~/server/validations';

const defaultValidation = {
  artworks: Joi.array().required().max(30),
  description: Joi.string().required(),
  documents: documentsValidation.max(1),
  images: imagesValidation.max(10),
  title: Joi.string().max(128).required(),
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
      orderKey: Joi.string().valid('id', 'createdAt', 'updatedAt', 'title'),
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
