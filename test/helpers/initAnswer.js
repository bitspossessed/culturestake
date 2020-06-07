import adminTx from '.adminTx';
import Answers from '~/server/models/answer';

export default async (questionContract, answerPk) => {
  const answer = await Answers.findByPk(answerPk);
  const data = questionContract.methods.initAnswer(answer.chainId).encodeABI();
  await adminTx(questionContract, data);
  return answer;
};
