import detectEthereumProvider from '@metamask/detect-provider';

export async function detectMetaMask() {
  return await detectEthereumProvider({
    mustBeMetaMask: true,
    timeout: 5000,
  });
}
