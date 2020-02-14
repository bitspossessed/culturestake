import { Joi, Segments } from 'celebrate';

export default {
  requestToken: {
    [Segments.BODY]: Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required(),
    }).required(),
  },
};
