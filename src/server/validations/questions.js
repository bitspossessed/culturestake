import { Joi, Segments } from 'celebrate';

import { idValidation, paginationValidation } from '~/server/validations';
import { web3Validators } from '~/common/helpers/validate';

const defaultValidation = {
  title: Joi.string().max(128).required(),
  address: web3Validators.web3().address(),
  festivalId: Joi.number().integer().required(),
  artworkId: Joi.number().integer(),
  answers: Joi.array()
    .items(
      Joi.object().keys({
        id: Joi.number().positive(),
      }),
    )
    .max(10),
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
