export default function festivals(adminContract) {
  return {
    isFestivalInited: async (festivalHexId) => {
      const festival = await this.getFestival(festivalHexId);
      return festival.inited;
    },

    isFestivalDeactivated: async (festivalHexId) => {
      const festival = await this.getFestival(festivalHexId);
      return festival.deactivated;
    },

    isActiveFestival: async (festivalHexId) => {
      return adminContract.methods.isActiveFestival(festivalHexId).call();
    },

    getFestival: async (festivalHexId) => {
      const festival = await adminContract.methods
        .isFestivalInited(festivalHexId)
        .call();
      return {
        inited: festival[0],
        deactivated: festival[1],
        startTime: festival[2],
        endTime: festival[3],
      };
    },

    initFestival: async () => {
    },

    deactivateFestival: async () => {
    },
  }
}
