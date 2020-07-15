import web3 from '~/common/services/web3';

export const boothTypes = ['uint256[]', 'uint256'];

export const voteTypes = ['uint256[]', 'uint256[]', 'uint256[]', 'uint256[]'];

export function packBooth(answerIds, nonce) {
  return pack(boothTypes, [answerIds, nonce]);
}

export function packVote(
  festivalAnswerIds,
  festivalVoteTokens,
  artworkAnswerIds,
  artworkVoteTokens,
) {
  return pack(voteTypes, [
    festivalAnswerIds,
    festivalVoteTokens,
    artworkAnswerIds,
    artworkVoteTokens,
  ]);
}

export function pack(types, args) {
  return web3.eth.abi.encodeParameters(types, args).toString('hex');
}
