import { Joi, Segments } from 'celebrate';

import { slugValidation } from '~/server/validations';
import { web3Validators } from '~/common/helpers/validate';

export default {
  vote: {
    [Segments.BODY]: {
      artworkAnswerIds: Joi.array().items(Joi.number().positive()),
      artworkQuestionId: Joi.number().positive().required(),
      artworkVoteTokens: Joi.array().items(Joi.number().positive()),
      boothAddress: web3Validators.web3().address().required(),
      boothSignature: web3Validators.web3().signature().required(),
      festivalAnswerIds: Joi.array().items(Joi.number().positive()),
      festivalQuestionId: Joi.number().positive().required(),
      festivalVoteTokens: Joi.array().items(Joi.number().positive()),
      nonce: Joi.number().required(),
      senderAddress: web3Validators.web3().address().required(),
      senderSignature: web3Validators.web3().signature().required(),
    },
  },
  results: {
    [Segments.PARAMS]: {
      ...slugValidation,
    },
  },
};
