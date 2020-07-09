export const INITIALIZED_BOOTH = Symbol('INITIALIZED_BOOTH');
export const DEACTIVATED_BOOTH = Symbol('DEACTIVATED_BOOTH');

export default function booths(adminContract) {
  return {
    isBoothInitialized: async (boothAddress) => {
      const booth = await this.getBooth(boothAddress);
      return booth.initialized;
    },

    isBoothDeactivated: async (boothAddress) => {
      const booth = await this.getBooth(boothAddress);
      return booth.deactivated;
    },

    isVotingNonceFresh: async (boothAddress, nonce) => {
      return adminContract.methods
        .isValidVotingNonce(boothAddress, nonce)
        .call();
    },

    getBooth: async (boothAddress) => {
      const booth = await adminContract.methods.getBooth(boothAddress).call();
      return {
        initialized: booth[0],
        deactivated: booth[1],
        festival: booth[2],
      };
    },

    initializeVotingBooth: async (sender, boothAddress) => {
      const txhash = await adminContract.methods
        .initVotingBooth(boothAddress)
        .send({ from: sender });
      return { txhash, txMethod: INITIALIZED_BOOTH };
    },

    deactivateVotingBooth: async (sender, boothAddress) => {
      const txhash = await adminContract.methods
        .deactivateVotingBooth(boothAddress)
        .send({ from: sender });
      return { txhash, txMethod: DEACTIVATED_BOOTH };
    },
  };
}
