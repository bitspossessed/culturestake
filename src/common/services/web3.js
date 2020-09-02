import Web3 from 'web3';

export const provider =
  typeof window !== 'undefined'
    ? window.ethereum ||
      new Web3.providers.WebsocketProvider(
        process.env.ETHEREUM_NODE_ENDPOINT_WS,
      )
    : new Web3.providers.HttpProvider(process.env.ETHEREUM_NODE_ENDPOINT);

const web3 = new Web3(provider);

export async function checkConnection() {
  return (await web3.eth.getBlock('latest')).number;
}

export default web3;
