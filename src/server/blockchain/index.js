const Web3 = require('web3');
import config from '~/server/blockchain/config';

const rpcUrl = config.rpcUrl;
const provider = new Web3.providers.WebsocketProvider(rpcUrl);
const web3 = new Web3(provider);

// const txRelayAddress =
//   TxRelayContractJSON.networks[process.env.NETWORK_ID].address ||
//   process.env.RELAY_CONTRACT_ADDRESS
// const txRelayABI = TxRelayContractJSON.abi

module.exports = {
  web3,
  provider,
  // txRelayAddress,
  // txRelayABI
};
