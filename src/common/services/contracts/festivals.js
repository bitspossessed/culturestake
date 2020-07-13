import { adminContract } from '~/common/services/contracts';

export const TX_INITIALIZE_FESTIVAL = Symbol('TX_INITIALIZE_FESTIVAL');
export const TX_DEACTIVATE_FESTIVAL = Symbol('TX_DEACTIVATE_FESTIVAL');

export async function isFestivalInitialized(chainId) {
  const festival = await getFestival(chainId);
  return festival.initialized;
}

export async function isFestivalDeactivated(chainId) {
  const festival = await getFestival(chainId);
  return festival.deactivated;
}

export async function isActiveFestival(chainId) {
  return adminContract.methods.isActiveFestival(chainId).call();
}

export async function getFestival(chainId) {
  const festival = await adminContract.methods.getFestival(chainId).call();
  return {
    initialized: festival[0],
    deactivated: festival[1],
    startTime: festival[2],
    endTime: festival[3],
  };
}

export async function initializeFestival(sender, chainId, startTime, endTime) {
  const txHash = await adminContract.methods
    .initFestival(chainId, startTime, endTime)
    .send({ from: sender });
  return { txHash, txMethod: TX_INITIALIZE_FESTIVAL };
}

export async function deactivateFestival(sender, chainId) {
  const txHash = await adminContract.methods
    .initFestival(chainId)
    .send({ from: sender });
  return { txHash, txMethod: TX_DEACTIVATE_FESTIVAL };
}
