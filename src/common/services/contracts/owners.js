import { SENTINEL_ADDRESS } from '~/common/utils/constants';
import { adminContract } from '~/common/services/contracts';

export const TX_ADD_OWNER = Symbol('TX_ADD_OWNER');
export const TX_REMOVE_OWNER = Symbol('TX_REMOVE_OWNER');

export async function isOwner(ownerAddress) {
  return adminContract.methods.isOwner(ownerAddress).call();
}

export async function getOwners() {
  return adminContract.methods.getOwners().call();
}

export async function addOwner(senderAddress, ownerAddress) {
  const { transactionHash: txHash } = await adminContract.methods
    .addOwner(ownerAddress)
    .send({
      from: senderAddress,
    });

  return { txHash, txMethod: TX_ADD_OWNER };
}

export async function removeOwner(senderAddress, ownerAddress) {
  const owners = await getOwners();

  // .. to find out which previous owner in the list is pointing at the one we
  // want to remove
  const ownerIndex = owners.findIndex((owner) => owner === ownerAddress);
  const prevOwner = ownerIndex > 0 ? owners[ownerIndex - 1] : SENTINEL_ADDRESS;

  const { transactionHash: txHash } = await adminContract.methods
    .removeOwner(prevOwner, ownerAddress)
    .send({
      from: senderAddress,
    });

  return { txHash, txMethod: TX_REMOVE_OWNER };
}
