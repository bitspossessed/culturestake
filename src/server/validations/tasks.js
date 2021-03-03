import { Joi, Segments } from 'celebrate';

const taskKind = Joi.string().valid('vote_invitations').required();

const defaultValidation = {
  kind: taskKind,
  data: Joi.alternatives().conditional('kind', {
    switch: [
      {
        is: 'vote_invitations',
        then: Joi.array()
          .items(
            Joi.object({
              to: Joi.string().email().required(),
            }),
          )
          .min(1)
          .required(),
        otherwise: Joi.object().allow(null).default(null),
      },
    ],
  }),
};

export default {
  create: {
    [Segments.BODY]: {
      ...defaultValidation,
    },
  },
};
