import detectEthereumProvider from '@metamask/detect-provider';

if (window.ethereum) {
  // https://docs.metamask.io/guide/ethereum-provider.html#ethereum-autorefreshonnetworkchange
  window.ethereum.autoRefreshOnNetworkChange = false;
}

let provider;

export async function detectMetaMask() {
  provider = await detectEthereumProvider({
    mustBeMetaMask: true,
    timeout: 5000,
  });

  return provider;
}

export async function enableProvider() {
  if (!provider) {
    throw new Error('Provider not given');
  }

  return await provider.enable();
}
