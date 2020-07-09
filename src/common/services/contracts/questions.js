import adminContract from '~/common/services/contracts';

export const INITIALIZED_QUESTION = Symbol('TX_INITIALIZED_QUESTION');
export const DEACTIVATED_QUESTION = Symbol('TX_DEACTIVATED_QUESTION');

export async function initializeQuestion(
  sender,
  maxVoteTokens,
  festivalChainId,
) {
  const txhash = await adminContract.methods
    .initQuestion(maxVoteTokens, festivalChainId)
    .send({ from: sender });
  return { txhash, txMethod: INITIALIZED_QUESTION };
}

export async function deactivateQuestion(sender, questionAddress) {
  const txhash = await adminContract.methods
    .deactivateQuestion(questionAddress)
    .send({ from: sender });
  return { txhash, txMethod: DEACTIVATED_QUESTION };
}
