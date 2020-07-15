import web3 from '~/common/services/web3';
import { getQuestionContract } from '~/common/services/contracts';

const { PAYER_PRIV_KEY } = process.env;

const payer = web3.eth.accounts.privateKeyToAccount(`0x${PAYER_PRIV_KEY}`);

export default async function dispatchVote({
  answerChainIds,
  boothAddress,
  nonce,
  questionAddress,
  voteTokens,
}) {
  const questionContract = getQuestionContract(questionAddress);

  const data = questionContract.methods
    .recordUnsignedVote(answerChainIds, voteTokens, boothAddress, nonce)
    .encodeABI();

  const from = payer.address;
  const to = questionAddress;
  const txNonce = await web3.eth.getTransactionCount(payer.address);
  const gas = await web3.eth.estimateGas({ to, data });

  const signed = await web3.eth.accounts.signTransaction(
    {
      from,
      to,
      data,
      nonce: txNonce,
      gas,
    },
    PAYER_PRIV_KEY,
  );

  return web3.eth.sendSignedTransaction(signed.rawTransaction);
}
