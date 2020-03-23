import { celebrate, Joi } from 'celebrate';

import web3 from '~/common/services/web3';

export const web3Validators = Joi.extend(joi => {
  return {
    type: 'web3',
    base: joi.string(),
    messages: {
      'web3.address': 'is invalid Ethereum address',
      'web3.addressChecksum': 'is invalid Ethereum address checksum',
      'web3.signature': 'is invalid Ethereum signature',
    },
    rules: {
      address: {
        validate(value, helpers) {
          if (!value || !web3.utils.isAddress(value)) {
            return helpers.error('web3.address');
          }

          return value;
        },
      },
      addressChecksum: {
        validate(value, helpers) {
          if (!value || !web3.utils.checkAddressChecksum(value)) {
            return helpers.error('web3.addressChecksum');
          }

          return value;
        },
      },
      signature: {
        params: {
          message: joi.string().required(),
          address: joi
            .string()
            .required()
            .max(40),
        },
        validate(params, value, helpers) {
          let recovered;
          try {
            recovered = web3.eth.accounts.recover(params.message, value);
          } catch (err) {
            return helpers.error('web3.signature');
          }
          if (!value || recovered !== params.address) {
            return helpers.error('web3.signature');
          }
          return value;
        },
      },
    },
  };
});

export default function validate(schema) {
  const joiOptions = {
    abortEarly: false,
    debug: process.env.NODE_ENV !== 'production',
  };

  return celebrate(schema, joiOptions);
}
