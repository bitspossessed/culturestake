import { Joi, Segments } from 'celebrate';

const defaultValidation = {
  sigR: Joi.string()
    .max(64)
    .required(),
  sigS: Joi.string()
    .max(64)
    .required(),
  sigV: Joi.number().required(),
  boothR: Joi.string()
    .max(64)
    .required(),
  boothS: Joi.string()
    .max(64)
    .required(),
  boothV: Joi.number().required(),
  nonce: Joi.number().required(),
  festival: Joi.string()
    .max(64)
    .required(),
  answers: Joi.array()
    .items(Joi.string().max(64))
    .required(),
  voteTokens: Joi.array()
    .items(Joi.number())
    .length(Joi.ref('answers').length),
};

export default {
  create: {
    [Segments.BODY]: {
      ...defaultValidation,
    },
  },
};
