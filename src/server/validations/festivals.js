import { Joi, Segments } from 'celebrate';

import {
  documentsValidation,
  imagesValidation,
  queryValidation,
  stickerValidation,
  web3Validators,
} from '~/common/helpers/validate';
import { slugValidation, paginationValidation } from '~/server/validations';

const defaultValidation = {
  artworks: Joi.array().required().items(Joi.object()).max(30),
  description: Joi.string().max(2000).required(),
  documents: documentsValidation.max(3),
  images: imagesValidation.max(10),
  online: Joi.boolean().falsy(''),
  sticker: stickerValidation.required(),
  subtitle: Joi.string().max(255).required(),
  title: Joi.string().max(128).required(),
  url: Joi.string().uri().allow(''),
};

const createValidation = {
  ...defaultValidation,
  question: {
    title: Joi.string().max(128).required(),
    type: Joi.valid('festival').required(),
  },
};

export default {
  getArtworks: {
    [Segments.PARAMS]: {
      ...slugValidation,
    },
  },
  getQuestions: {
    [Segments.PARAMS]: {
      idOrChainId: Joi.alternatives().try(
        Joi.number().integer().positive().required(),
        Joi.string().required(),
        web3Validators.web3().sha3().required(),
      ),
    },
  },
  create: {
    [Segments.BODY]: {
      ...createValidation,
    },
  },
  readAll: {
    [Segments.PARAMS]: {
      ...paginationValidation,
      ...queryValidation,
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
