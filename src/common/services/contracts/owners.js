export const ADDED_OWNER = Symbol('ADDED_OWNER');
export const REMOVED_OWNER = Symbol('REMOVED_OWNER');

export default function owners(adminContract) {
  return {
    isOwner: async (ownerAddress) => {
      return adminContract.methods.isOwner(ownerAddress).call();
    },

    getOwners: async (ownerAddress) => {
      return adminContract.methods.getOwners(ownerAddress).call();
    },

    addOwner: async (sender, ownerAddress) => {
      const txhash = await adminContract.methods
        .addOwner(ownerAddress)
        .send({ from: sender });
      return { txhash, txMethod: ADDED_OWNER };
    },

    removeOwner: async (sender, ownerAddress) => {
      const txhash = await adminContract.methods
        .removeOwner(ownerAddress)
        .send({ from: sender });
      return { txhash, txMethod: REMOVED_OWNER };
    },
  };
}
