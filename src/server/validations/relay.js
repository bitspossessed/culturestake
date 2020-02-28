import { Joi, Segments } from 'celebrate';

export default {
  metatx: {
    [Segments.BODY]: Joi.object({
      metaNonce: Joi.string().required(),
      metaSignedTx: Joi.string().required(),
    }).required(),
  },
};
