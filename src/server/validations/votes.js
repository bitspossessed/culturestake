import { Joi, Segments } from 'celebrate';

import { voteTypes, boothTypes } from '~/common/services/encoding';
import { web3Validators } from '~/server/helpers/validate';

const defaultValidation = {
  signature: web3Validators
    .web3()
    .signature(
      voteTypes,
      Joi.ref('answers'),
      Joi.ref('voteTokens'),
      Joi.ref('sender'),
    ),
  sender: web3Validators.web3().address(),
  booth: web3Validators.web3().address(),
  boothSignature: web3Validators
    .web3()
    .signature(
      boothTypes,
      Joi.ref('answers'),
      Joi.ref('nonce'),
      Joi.ref('booth'),
    ),
  nonce: Joi.number().required(),
  festival: Joi.string()
    .max(66)
    .required(),
  answers: Joi.array()
    .items(Joi.string().max(66))
    .required(),
  voteTokens: Joi.array()
    .items(Joi.number())
    .length(Joi.ref('answers').length),
};

export default {
  create: {
    [Segments.BODY]: {
      ...defaultValidation,
    },
  },
};
