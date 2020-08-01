import { Joi } from 'celebrate';

export const paginationValidation = {
  limit: Joi.number().min(1).max(500),
  offset: Joi.number(),
  orderDirection: Joi.string().lowercase().valid('asc', 'desc'),
  orderKey: Joi.string().valid('id', 'createdAt', 'updatedAt'),
};

export const slugValidation = {
  slug: Joi.string().required(),
};

export const idValidation = {
  id: Joi.number().integer().positive().required(),
};

export const queryValidation = {
  query: Joi.string().when('queryParam', {
    is: Joi.exist(),
    then: Joi.string().min(1).required(),
  }),
  queryParam: Joi.string(),
};
