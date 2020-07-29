import { Segments } from 'celebrate';

import { web3Validators } from '~/common/helpers/validate';

export default {
  getArtworks: {
    [Segments.PARAMS]: {
      festivalChainId: web3Validators.web3().sha3().required(),
    },
  },
};
