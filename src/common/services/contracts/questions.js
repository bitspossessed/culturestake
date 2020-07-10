import { adminContract } from '~/common/services/contracts';

export const TX_INITIALIZED_QUESTION = Symbol('TX_INITIALIZED_QUESTION');
export const TX_DEACTIVATED_QUESTION = Symbol('TX_DEACTIVATED_QUESTION');

export async function initializeQuestion(
  sender,
  maxVoteTokens,
  festivalChainId,
) {
  const txHash = await adminContract.methods
    .initQuestion(maxVoteTokens, festivalChainId)
    .send({ from: sender });
  return { txHash, txMethod: TX_INITIALIZED_QUESTION };
}

export async function deactivateQuestion(sender, questionAddress) {
  const txHash = await adminContract.methods
    .deactivateQuestion(questionAddress)
    .send({ from: sender });
  return { txHash, txMethod: TX_DEACTIVATED_QUESTION };
}
