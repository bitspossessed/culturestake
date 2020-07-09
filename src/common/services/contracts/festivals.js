export const INITIALIZE_FESTIVAL = Symbol('INITIALIZE_FESTIVAL');
export const DEACTIVATE_FESTIVAL = Symbol('DEACTIVATE_FESTIVAL');

export default function festivals(adminContract) {
  return {
    isFestivalInited: async (chainId) => {
      const festival = await this.getFestival(chainId);
      return festival.inited;
    },

    isFestivalDeactivated: async (chainId) => {
      const festival = await this.getFestival(chainId);
      return festival.deactivated;
    },

    isActiveFestival: async (chainId) => {
      return adminContract.methods.isActiveFestival(chainId).call();
    },

    getFestival: async (chainId) => {
      const festival = await adminContract.methods
        .isFestivalInited(chainId)
        .call();
      return {
        inited: festival[0],
        deactivated: festival[1],
        startTime: festival[2],
        endTime: festival[3],
      };
    },

    initFestival: async (sender, chainId) => {
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
