import Web3 from 'web3';

const rpcUrl = process.env.ETHEREUM_NODE_ENDPOINT_WS;

const provider =
  typeof window !== 'undefined' && window.ethereum
    ? window.ethereum
    : new Web3.providers.WebsocketProvider(rpcUrl);


const web3 = new Web3(provider);

export async function checkConnection() {
  return (await web3.eth.getBlock('latest')).number;
}

export default web3;
