import { Joi, Segments } from 'celebrate';
import { web3Validators } from '~/common/helpers/validate';

const taskKind = Joi.string().valid('vote_invitations', 'vote').required();

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
              booth: web3Validators.web3().address().required(),
              boothSignature: Joi.string().required(),
              festivalSlug: Joi.string().required(),
              festivalAnswerIds: Joi.array().required().items(Joi.number()),
              festivalQuestionId: Joi.number().required(),
              nonce: Joi.number().required(),
              organisationId: Joi.number().allow(null),
            }),
          )
          .min(1)
          .required(),
      },
      {
        is: 'vote',
        then: Joi.object({
          email: Joi.string().email().required(),
          festivalSlug: Joi.string().required(),
        }),
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
