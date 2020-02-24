import { Joi, Segments } from 'celebrate';

export default {
  metatx: {
    [Segments.BODY]: Joi.object({
      data: Joi.string().required(),
      signature: Joi.string().required(),
    }).required(),
  },
};
