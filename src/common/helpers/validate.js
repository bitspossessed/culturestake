import { Joi } from 'celebrate';

import web3 from '~/common/services/web3';

export const VOTEWEIGHT_TYPES = ['location', 'hotspot', 'organisation'];

// Attachements validations

const filesBaseValidation = {
  id: Joi.number().required(),
  createdAt: Joi.date().iso().required(),
  updatedAt: Joi.date().iso().required(),
  fileName: Joi.string().required(),
  fileType: Joi.string().required(),
  url: Joi.string().uri({ relativeOnly: true }).required(),
};

export const documentsValidation = Joi.array()
  .required()
  .items(
    Joi.object({
      ...filesBaseValidation,
    }),
  );

export const imageValidation = Joi.object({
  ...filesBaseValidation,
  urlThreshold: Joi.string().uri({ relativeOnly: true }).required(),
  urlThresholdThumb: Joi.string().uri({ relativeOnly: true }).required(),
  urlThumb: Joi.string().uri({ relativeOnly: true }).required(),
});

export const imagesValidation = Joi.array().required().items(imageValidation);

// Sticker validations

export const stickerValidation = Joi.string().pattern(
  new RegExp(
    '[|_[/]{3}(?:(?:[1-9][0-9]{1,2}|[1-9][0-9]{1,2}/)*[1-9][0-9]{1,2}|[1-9][0-9]{1,2})?',
  ),
);

// Web3 validations

export const web3Validators = Joi.extend((joi) => {
  return {
    type: 'web3',
    base: joi.string(),
    messages: {
      'web3.address': 'is invalid Ethereum address',
      'web3.addressChecksum': 'is invalid Ethereum address checksum',
      'web3.sha3': 'is invalid SHA3 hash',
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
      sha3: {
        validate(value, helpers) {
          if (!value || !web3.utils.isHexStrict(value) || value.length !== 66) {
            return helpers.error('web3.sha3');
          }

          return value;
        },
      },
      signature: {
        validate(value, helpers) {
          if (
            !value ||
            !web3.utils.isHexStrict(value) ||
            value.length !== 132
          ) {
            return helpers.error('web3.signature');
          }

          return value;
        },
      },
    },
  };
});
