import web3 from '~/common/services/web3';
import { refreshNonce } from './utils';
import { packBooth, packVote } from '~/common/services/encoding';

export default (booth, sender, votedata) => {
  const nonce = refreshNonce();
  return {
    ...votedata,
    signature: web3.eth.accounts.sign(
      packVote(
        votedata.festivalAnswers,
        votedata.festivalVoteTokens,
        votedata.artworkAnswers,
        votedata.artworkVoteTokens,
      ),
      sender.privateKey,
    ).signature,
    sender: sender.address,
    booth: booth.address,
    boothSignature: web3.eth.accounts.sign(
      packBooth(votedata.festivalAnswers, nonce),
      booth.privateKey,
    ).signature,
    nonce,
    festivalQuestion: votedata.festivalQuestion.options.address,
    artworkQuestion: votedata.artworkQuestion.options.address,
  };
};
