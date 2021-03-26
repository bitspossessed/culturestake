import { Joi, Segments } from 'celebrate';

const paramsValidation = {
  token: Joi.string().required(),
};

export default {
  read: {
    [Segments.PARAMS]: {
      ...paramsValidation,
    },
  },
};
