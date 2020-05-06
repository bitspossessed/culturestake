import web3 from '~/common/services/web3';
import { getQuestionContract } from '~/common/services/contracts';

const { PAYER_PRIV_KEY } = process.env;

const payer = web3.eth.accounts.privateKeyToAccount(`0x${PAYER_PRIV_KEY}`);

export default async function dispatchVote({
  booth,
  nonce,
  answers,
  voteTokens,
  question,
}) {
  const questionContract = getQuestionContract(question);

  const data = questionContract.methods
    .recordUnsignedVote(answers, voteTokens, booth, nonce)
    .encodeABI();

  const txNonce = await web3.eth.getTransactionCount(payer.address);
  const gas = await web3.eth.estimateGas({ to: question, data });

  const signed = await web3.eth.accounts.signTransaction(
    {
      from: payer.address,
      to: question,
      data,
      nonce: txNonce,
      gas: gas.toString(),
    },
    PAYER_PRIV_KEY,
  );

  return web3.eth.sendSignedTransaction(signed.rawTransaction);
}
