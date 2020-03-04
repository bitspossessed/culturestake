import MetaTxHandler from 'metatx-handler';

import { provider } from '~/common/services/web3';
import { getRelayerContract } from '~/common/services/contracts';
import logger from '~/server/helpers/logger';

const relayer = getRelayerContract(process.env.RELAYER_CONTRACT);

const metaTxHandler = new MetaTxHandler(
  process.env.PAYER_PRIV_KEY,
  provider,
  relayer.options.address,
  relayer.options.jsonInterface,
  logger,
);

export default metaTxHandler;
