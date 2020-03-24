import { celebrate, Joi } from 'celebrate';

import web3 from '~/common/services/web3';

import { pack } from '~/common/services/encoding';

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
        args: [
          {
            name: 'types',
            ref: false,
            assert: (value) => joi.array().items(joi.string()),
            message: 'must be a string',
          },
          {
            name: 'payload1',
            ref: true,
            assert: (value) => joi.any(),
            message: 'must be a string',
          },
          {
            name: 'payload2',
            ref: true,
            assert: (value) => joi.any(),
            message: 'must be a string',
          },
          {
            name: 'address',
            ref: true,
            assert: (value) => joi.string().max(40),
            message: 'must be a string',
          },
        ],
        method(types, payload1, payload2, address) {
          return this.$_addRule({ name: 'signature', args: { types, payload1, payload2, address } });
        },
        validate(value, helpers, args, something, somethingelse) {
          console.log('vaidating signature');
          let recovered;
          let message = pack(args.types, [args.payload1, args.payload2]);
          try {
            recovered = web3.eth.accounts.recover(message, value);
          } catch (err) {
            return helpers.error('web3.signature');
          }
          if (!value || recovered !== args.address) {
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
