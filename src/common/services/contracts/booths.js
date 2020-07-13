import { adminContract } from '~/common/services/contracts';

export const TX_INITIALIZED_BOOTH = Symbol('TX_INITIALIZED_BOOTH');
export const TX_DEACTIVATED_BOOTH = Symbol('TX_DEACTIVATED_BOOTH');

export async function isBoothInitialized(boothAddress) {
  const booth = await this.getBooth(boothAddress);
  return booth.initialized;
}

export async function isBoothDeactivated(boothAddress) {
  const booth = await this.getBooth(boothAddress);
  return booth.deactivated;
}

export async function isVotingNonceFresh(boothAddress, nonce) {
  return adminContract.methods.isValidVotingNonce(boothAddress, nonce).call();
}

export async function getBooth(boothAddress) {
  const booth = await adminContract.methods.getBooth(boothAddress).call();
  return {
    initialized: booth[0],
    deactivated: booth[1],
    festival: booth[2],
  };
}

export async function initializeVotingBooth(sender, boothAddress) {
  const txHash = await adminContract.methods
    .initVotingBooth(boothAddress)
    .send({ from: sender });
  return { txHash, txMethod: TX_INITIALIZED_BOOTH };
}

export async function deactivateVotingBooth(sender, boothAddress) {
  const txHash = await adminContract.methods
    .deactivateVotingBooth(boothAddress)
    .send({ from: sender });
  return { txHash, txMethod: TX_DEACTIVATED_BOOTH };
}
