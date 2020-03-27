import { Joi, Segments } from 'celebrate';

import { web3Validators } from '~/server/helpers/validate';

const defaultValidation = {
  signature: Joi.string()
    .max(132)
    .required(),
  sender: web3Validators.web3().address(),
  booth: web3Validators.web3().address(),
  boothSignature: Joi.string()
    .max(132)
    .required(),
  nonce: Joi.number().required(),
  question: web3Validators.web3().address(),
  answers: Joi.array()
    .items(Joi.string().max(66))
    .required(),
  voteTokens: Joi.array().items(Joi.number().positive()),
};

export default {
  create: {
    [Segments.BODY]: {
      ...defaultValidation,
    },
  },
};
