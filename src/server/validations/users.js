import { Joi, Segments } from 'celebrate';

import { paginationValidation } from './';

const usernameValidation = {
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(24)
    .required(),
};

const defaultValidation = {
  ...usernameValidation,
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .max(128)
    .required(),
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
      orderKey: Joi.string().valid(
        'id',
        'createdAt',
        'updatedAt',
        'email',
        'username',
      ),
    },
  },
  read: {
    [Segments.PARAMS]: {
      ...usernameValidation,
    },
  },
  update: {
    [Segments.PARAMS]: {
      ...usernameValidation,
    },
    [Segments.BODY]: {
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(24),
      email: Joi.string().email(),
    },
  },
  destroy: {
    [Segments.PARAMS]: {
      ...usernameValidation,
    },
  },
};
