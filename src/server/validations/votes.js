import { Joi, Segments } from 'celebrate';

import { slugValidation, idValidation } from '~/server/validations';
import { web3Validators } from '~/common/helpers/validate';

export default {
  vote: {
    [Segments.BODY]: {
      artworkAnswerIds: Joi.array().items(Joi.number().positive()),
      artworkQuestionId: Joi.number().positive().required(),
      artworkVoteTokens: Joi.array().items(Joi.number()),
      boothAddress: web3Validators.web3().address().required(),
      boothSignature: web3Validators.web3().signature().required(),
      festivalAnswerIds: Joi.array().items(Joi.number().positive()),
      festivalQuestionId: Joi.number().positive().required(),
      festivalVoteTokens: Joi.array().items(Joi.number()),
      nonce: Joi.number().required(),
      senderAddress: web3Validators.web3().address().required(),
      senderSignature: web3Validators.web3().signature().required(),
      latitude: Joi.number().min(-90).max(90).allow(null),
      longitude: Joi.number().min(-180).max(180).allow(null),
      organisationId: Joi.number().positive().allow(null),
    },
  },
  results: {
    [Segments.PARAMS]: {
      ...slugValidation,
    },
  },
  read: {
    [Segments.PARAMS]: {
      ...idValidation,
    },
  },
};
