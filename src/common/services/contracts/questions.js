import { adminContract } from '~/common/services/contracts';

export const TX_INITIALIZE_QUESTION = Symbol('TX_INITIALIZE_QUESTION');
export const TX_DEACTIVATE_QUESTION = Symbol('TX_DEACTIVATE_QUESTION');

export async function isQuestionInitialized(chainId) {
  const question = await getQuestion(chainId);
  return question.initialized;
}

export async function isQuestionDeactivated(chainId) {
  const question = await getQuestion(chainId);
  return question.deactivated;
}

export async function getQuestion(chainId) {
  const question = await adminContract.methods.getQuestion(chainId).call();
  return {
    initialized: question[0],
    deactivated: question[1],
    address: question[2],
    festival: question[3],
    maxVoteTokens: question[4],
  };
}

export async function initializeQuestion(
  sender,
  chainId,
  maxVoteTokens,
  festivalChainId,
) {
  const txHash = await adminContract.methods
    .initQuestion(chainId, maxVoteTokens, festivalChainId)
    .send({ from: sender });
  return { txHash, txMethod: TX_INITIALIZE_QUESTION };
}

export async function deactivateQuestion(sender, questionAddress) {
  const txHash = await adminContract.methods
    .deactivateQuestion(questionAddress)
    .send({ from: sender });
  return { txHash, txMethod: TX_DEACTIVATE_QUESTION };
}
