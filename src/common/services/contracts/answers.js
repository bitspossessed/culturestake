import { getQuestionContract } from '~/common/services/contracts';
import { getQuestion } from '~/common/services/contracts/questions';

export const TX_INITIALIZE_ANSWER = Symbol('TX_INITIALIZE_ANSWER');
export const TX_DEACTIVATE_ANSWER = Symbol('TX_DEACTIVATE_ANSWER');

export async function getQuestionContractFromChainId(chainId) {
  const question = await getQuestion(chainId);
  return getQuestionContract(question.address);
}

export async function isAnswerInitialized(questionChainId, answerChainId) {
  const answer = await getAnswer(questionChainId, answerChainId);
  return answer.initialized;
}

export async function isAnswerDeactivated(questionChainId, answerChainId) {
  const answer = await getAnswer(questionChainId, answerChainId);
  return answer.deactivated;
}

export async function getAnswer(questionChainId, answerChainId) {
  const question = await getQuestionContractFromChainId(questionChainId);
  const answer = await question.methods.getAnswer(answerChainId).call();
  return {
    initialized: answer[0],
    deactivated: answer[1],
    votePower: answer[2],
    voteTokens: answer[3],
    votes: answer[4],
  };
}

export async function initializeAnswer(sender, questionChainId, answerChainId) {
  const question = await getQuestionContractFromChainId(questionChainId);
  const { transactionHash: txHash } = await question.methods
    .initAnswer(answerChainId)
    .send({ from: sender });
  return { txHash, txMethod: TX_INITIALIZE_ANSWER };
}

export async function deactivateAnswer(sender, questionChainId, answerChainId) {
  const question = await getQuestionContractFromChainId(questionChainId);
  const { transactionHash: txHash } = await question.methods
    .deactivateAnswer(answerChainId)
    .send({ from: sender });
  return { txHash, txMethod: TX_DEACTIVATE_ANSWER };
}
