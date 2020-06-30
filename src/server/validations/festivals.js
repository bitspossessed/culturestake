import { Joi, Segments } from 'celebrate';

import {
  imagesValidation,
  documentsValidation,
} from '~/common/helpers/validate';
import { slugValidation, paginationValidation } from '~/server/validations';

const defaultValidation = {
  title: Joi.string().max(128).required(),
  description: Joi.string().required(),
  images: imagesValidation.max(10),
  documents: documentsValidation.max(1),
  artworks: Joi.array().max(30),
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
