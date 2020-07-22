import { Joi, Segments } from 'celebrate';

import { slugValidation } from '~/server/validations';
import { web3Validators } from '~/common/helpers/validate';

const defaultValidation = {
  artworkAnswerIds: Joi.array().items(Joi.number().positive()),
  artworkQuestionId: Joi.number().positive().required(),
  artworkVoteTokens: Joi.array().items(Joi.number().positive()),
  festivalAnswerIds: Joi.array().items(Joi.number().positive()),
  festivalQuestionId: Joi.number().positive().required(),
  festivalVoteTokens: Joi.array().items(Joi.number().positive()),
  boothAddress: web3Validators.web3().address().required(),
  boothSignature: Joi.string().length(132).required(),
  senderAddress: web3Validators.web3().address().required(),
  senderSignature: Joi.string().length(132).required(),
  nonce: Joi.number().required(),
};

export default {
  create: {
    [Segments.BODY]: {
      ...defaultValidation,
    },
  },
  read: {
    [Segments.PARAMS]: {
      ...slugValidation,
    },
  },
};
