import { Joi, Segments } from 'celebrate';

import {
  imagesValidation,
  documentsValidation,
  stickerValidation,
} from '~/common/helpers/validate';
import {
  paginationValidation,
  queryValidation,
  slugValidation,
} from '~/server/validations';

const defaultValidation = {
  artistId: Joi.number().integer().positive(),
  description: Joi.string().max(2000).required(),
  images: imagesValidation.max(10),
  documents: documentsValidation.max(3),
  sticker: stickerValidation.required(),
  title: Joi.string().max(128).required(),
  subtitle: Joi.string().max(255),
  url: Joi.string().uri(),
};

export default {
  create: {
    [Segments.BODY]: {
      ...defaultValidation,
    },
  },
  readAll: {
    [Segments.PARAMS]: {
      ...queryValidation,
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
