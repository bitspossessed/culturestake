export const INITIALIZE_FESTIVAL = Symbol('INITIALIZE_FESTIVAL');
export const DEACTIVATE_FESTIVAL = Symbol('DEACTIVATE_FESTIVAL');

export default function festivals(adminContract) {
  return {
    isFestivalInitialized: async (chainId) => {
      const festival = await this.getFestival(chainId);
      return festival.initialized;
    },

    isFestivalDeactivated: async (chainId) => {
      const festival = await this.getFestival(chainId);
      return festival.deactivated;
    },

    isActiveFestival: async (chainId) => {
      console.log('called', chainId)
      return adminContract.methods.isActiveFestival(chainId).call();
    },

    getFestival: async (chainId) => {
      const festival = await adminContract.methods.getFestival(chainId).call();
      return {
        initialized: festival[0],
        deactivated: festival[1],
        startTime: festival[2],
        endTime: festival[3],
      };
    },

    initializeFestival: async (sender, chainId) => {
      const txhash = await adminContract.methods
        .initFestival(chainId)
        .send({ from: sender });
      return { txhash, txMethod: INITIALIZE_FESTIVAL };
    },

    deactivateFestival: async (sender, chainId) => {
      const txhash = await adminContract.methods
        .initFestival(chainId)
        .send({ from: sender });
      return { txhash, txMethod: DEACTIVATE_FESTIVAL };
    },
  };
}
