import adminContract from '~/common/services/contracts';

export const ADDED_OWNER = Symbol('TX_ADDED_OWNER');
export const REMOVED_OWNER = Symbol('TX_REMOVED_OWNER');

export async function isOwner(ownerAddress) {
  return adminContract.methods.isOwner(ownerAddress).call();
}

export async function getOwners(ownerAddress) {
  return adminContract.methods.getOwners(ownerAddress).call();
}

export async function addOwner(sender, ownerAddress) {
  const txhash = await adminContract.methods
    .addOwner(ownerAddress)
    .send({ from: sender });
  return { txhash, txMethod: ADDED_OWNER };
}

export async function removeOwner(sender, ownerAddress) {
  const txhash = await adminContract.methods
    .removeOwner(ownerAddress)
    .send({ from: sender });
  return { txhash, txMethod: REMOVED_OWNER };
}
