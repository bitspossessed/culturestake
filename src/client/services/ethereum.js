import detectEthereumProvider from '@metamask/detect-provider';

if (window.ethereum) {
  // https://docs.metamask.io/guide/ethereum-provider.html#ethereum-autorefreshonnetworkchange
  window.ethereum.autoRefreshOnNetworkChange = false;
}

export async function detectMetaMask() {
  return await detectEthereumProvider({
    mustBeMetaMask: true,
    timeout: 5000,
  });
}
