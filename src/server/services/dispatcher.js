import web3 from '~/common/services/web3';
import { getQuestionContract } from '~/common/services/contracts';

const payerPrivKey = process.env.PAYER_PRIV_KEY;

const payer = web3.eth.accounts.privateKeyToAccount(`0x${payerPrivKey}`);

export default async function dispatchVote({
  booth,
  nonce,
  sender,
  answers,
  voteTokens,
  question,
}) {
  const q = getQuestionContract(question);
  const data = q.methods
    .recordUnsignedVote(answers, voteTokens, booth, nonce, sender)
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
    payerPrivKey,
  );
  return web3.eth.sendSignedTransaction(signed.rawTransaction);
}
