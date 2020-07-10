import { Joi, Segments } from 'celebrate';

import { web3Validators } from '~/common/helpers/validate';

export const paramValidation = {
  questionAddress: web3Validators.web3().address(),
};

const defaultValidation = {
  signature: Joi.string().max(132).required(),
  sender: web3Validators.web3().address(),
  booth: web3Validators.web3().address(),
  boothSignature: Joi.string().max(132).required(),
  nonce: Joi.number().required(),
  festivalQuestion: web3Validators.web3().address(),
  festivalAnswers: Joi.array().items(Joi.number().positive()).required(),
  festivalVoteTokens: Joi.array().items(Joi.number().positive()),
  artworkQuestion: web3Validators.web3().address(),
  artworkAnswers: Joi.array().items(Joi.number().positive()).required(),
  artworkVoteTokens: Joi.array().items(Joi.number().positive()),
};

export default {
  create: {
    [Segments.BODY]: {
      ...defaultValidation,
    },
  },
  read: {
    [Segments.PARAMS]: {
      ...paramValidation,
    },
  },
};
