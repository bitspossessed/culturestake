import web3 from '~/common/services/web3';
import { packBooth, packVote } from '~/common/services/encoding';

import { refreshNonce } from './nonce';

export default (booth, sender, voteData) => {
  const nonce = refreshNonce();

  const senderSignature = web3.eth.accounts.sign(
    packVote(
      voteData.festivalAnswerIds,
      voteData.festivalVoteTokens,
      voteData.artworkAnswerIds,
      voteData.artworkVoteTokens,
    ),
    sender.privateKey,
  ).signature;

  const boothSignature = web3.eth.accounts.sign(
    packBooth(voteData.festivalAnswerIds, nonce),
    booth.privateKey,
  ).signature;

  return {
    artworkAnswerIds: voteData.artworkAnswerIds,
    artworkQuestionAddress: voteData.artworkQuestionContract.options.address,
    artworkVoteTokens: voteData.artworkVoteTokens,
    festivalAnswerIds: voteData.festivalAnswerIds,
    festivalQuestionAddress: voteData.festivalQuestionContract.options.address,
    festivalVoteTokens: voteData.festivalVoteTokens,
    boothAddress: booth.address,
    boothSignature,
    senderAddress: sender.address,
    senderSignature,
    nonce,
  };
};
