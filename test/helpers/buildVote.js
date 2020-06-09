import web3 from '~/common/services/web3';
import { refreshNonce } from './utils';
import { packBooth, packVote } from '~/common/services/encoding';

export default (booth, sender, question, answers, votes) => {
  const nonce = refreshNonce();
  return {
    signature: web3.eth.accounts.sign(
      packVote(answers, votes),
      sender.privateKey,
    ).signature,
    sender: sender.address,
    booth: booth.address,
    boothSignature: web3.eth.accounts.sign(
      packBooth(answers, nonce),
      booth.privateKey,
    ).signature,
    nonce,
    question: question.options.address,
    answers,
    voteTokens: votes,
  };
};
