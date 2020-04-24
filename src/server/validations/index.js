import { Joi } from 'celebrate';

export const paginationValidation = {
  limit: Joi.number()
    .min(1)
    .max(500),
  offset: Joi.number().min(1),
  orderDirection: Joi.string()
    .lowercase()
    .valid('asc', 'desc'),
  orderKey: Joi.string().valid('id', 'createdAt', 'updatedAt'),
};

export const slugValidation = {
  slug: Joi.string().required(),
};

export const idValidation = {
  id: Joi.number()
    .integer()
    .positive()
    .required(),
};
