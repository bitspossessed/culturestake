import MetaTxHandler from 'metatx-handler';

import blockchain from '~/common/services/web3';
import { getRelayerContract } from '~/common/services/contracts';
import logger from '~/server/helpers/logger';

const relayer = getRelayerContract(
  blockchain.web3,
  process.env.RELAYER_CONTRACT,
);

const metaTxHandler = new MetaTxHandler(
  process.env.PAYER_PRIV_KEY,
  blockchain.provider,
  process.env.RELAYER_CONTRACT,
  relayer.options.jsonInterface,
  logger,
);

export default metaTxHandler;
