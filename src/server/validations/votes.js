import { Joi, Segments } from 'celebrate';

import { packBooth, packVotes } from '~/server/validations';

const defaultValidation = {
  signature: Joi.web3.signature(
    packVotes(Joi.ref('answers'), Joi.ref('voteTokens')),
    Joi.ref('sender'),
  ),
  sender: Joi.web3.address(),
  booth: Joi.web3.address(),
  boothSignature: Joi.web3.signature(
    packBooth(Joi.ref('answers'), Joi.ref('nonce')),
    Joi.ref('booth'),
  ),
  nonce: Joi.number().required(),
  festival: Joi.string()
    .max(64)
    .required(),
  answers: Joi.array()
    .items(Joi.string().max(64))
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
