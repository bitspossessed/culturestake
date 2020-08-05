import { adminContract } from '~/common/services/contracts';

export const TX_INITIALIZE_BOOTH = Symbol('TX_INITIALIZE_BOOTH');
export const TX_DEACTIVATE_BOOTH = Symbol('TX_DEACTIVATE_BOOTH');

export async function isValidVotingNonce(boothAddress, nonce) {
  return adminContract.methods.isValidVotingNonce(boothAddress, nonce).call();
}

export async function getVotingBooth(boothAddress) {
  const booth = await adminContract.methods.getVotingBooth(boothAddress).call();
  return {
    isInitialized: booth[0],
    isDeactivated: booth[1],
    festivalChainId: booth[2],
  };
}

export async function initializeVotingBooth(
  sender,
  festivalChainId,
  boothAddress,
) {
  const {
    transactionHash: txHash,
  } = await adminContract.methods
    .initVotingBooth(festivalChainId, boothAddress)
    .send({ from: sender });
  return { txHash, txMethod: TX_INITIALIZE_BOOTH };
}

export async function deactivateVotingBooth(sender, boothAddress) {
  const {
    transactionHash: txHash,
  } = await adminContract.methods
    .deactivateVotingBooth(boothAddress)
    .send({ from: sender });
  return { txHash, txMethod: TX_DEACTIVATE_BOOTH };
}
