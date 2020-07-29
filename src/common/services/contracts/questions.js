import { adminContract } from '~/common/services/contracts';

export const TX_INITIALIZE_QUESTION = Symbol('TX_INITIALIZE_QUESTION');
export const TX_DEACTIVATE_QUESTION = Symbol('TX_DEACTIVATE_QUESTION');

export async function initializeQuestion(
  sender,
  maxVoteTokens,
  festivalChainId,
) {
  const txHash = await adminContract.methods
    .initQuestion(maxVoteTokens, festivalChainId)
    .send({ from: sender });
  return { txHash, txMethod: TX_INITIALIZE_QUESTION };
}

export async function deactivateQuestion(sender, questionAddress) {
  const txHash = await adminContract.methods
    .deactivateQuestion(questionAddress)
    .send({ from: sender });
  return { txHash, txMethod: TX_DEACTIVATE_QUESTION };
}
