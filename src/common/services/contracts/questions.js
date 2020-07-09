export const INITIALIZED_QUESTION = Symbol('INITIALIZED_QUESTION');
export const DEACTIVATED_QUESTION = Symbol('DEACTIVATED_QUESTION');

export default function questions(adminContract) {
  return {
    initializeQuestion: async (sender, maxVoteTokens, festivalChainId) => {
      const txhash = await adminContract.methods
        .initQuestion(maxVoteTokens, festivalChainId)
        .send({ from: sender });
      return { txhash, txMethod: INITIALIZED_QUESTION };
    },

    deactivateQuestion: async (sender, questionAddress) => {
      const txhash = await adminContract.methods
        .deactivateQuestion(questionAddress)
        .send({ from: sender });
      return { txhash, txMethod: DEACTIVATED_QUESTION };
    },
  };
}
