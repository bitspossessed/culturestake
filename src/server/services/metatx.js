import MetaTxHandler from 'metatx-handler';
import relayerContract from 'culturestake-contracts/build/contracts/Relayer.json';

import blockchain from '~/common/services/web3';
import logger from '~/server/helpers/logger';

const metaTxHandler = new MetaTxHandler(
  process.env.PAYER_PRIV_KEY,
  blockchain.provider,
  process.env.RELAY_CONTRACT,
  relayerContract.abi,
  logger,
);

export default metaTxHandler;
