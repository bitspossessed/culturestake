import LocalMessageDuplexStream from 'post-message-stream';
import Web3 from 'web3';
import { initProvider } from '@metamask/inpage-provider';

// @NOTE: This is a workaround to make Firefox + MetaMask work with stricter
// CSP settings: https://github.com/MetaMask/metamask-extension/issues/3133
function initializeMetamaskProvider() {
  // Setup background connection
  const connectionStream = new LocalMessageDuplexStream({
    name: 'inpage',
    target: 'contentscript',
  });

  // Compose the inpage provider
  return initProvider({
    connectionStream,
  });
}

const provider =
  typeof window !== 'undefined'
    ? window.ethereum || initializeMetamaskProvider()
    : new Web3.providers.HttpProvider(process.env.ETHEREUM_NODE_ENDPOINT);

const web3 = new Web3(provider);

export async function checkConnection() {
  return (await web3.eth.getBlock('latest')).number;
}

export default web3;
