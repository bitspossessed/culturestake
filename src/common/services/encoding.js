import web3 from '~/common/services/web3';

export const boothTypes = ['uint256[]', 'uint256'];

export const voteTypes = ['uint256[]', 'uint256[]', 'uint256[]', 'uint256[]'];

export function packBooth(answers, nonce) {
  return pack(boothTypes, [answers, nonce]);
}

export function packVote(
  festivalAnswers,
  festivalVotes,
  artworkAnswers,
  artworkVotes,
) {
  return pack(voteTypes, [
    festivalAnswers,
    festivalVotes,
    artworkAnswers,
    artworkVotes,
  ]);
}

export function pack(types, args) {
  let encoded = web3.eth.abi.encodeParameters(types, args);
  return `0x${encoded.toString('hex')}`;
}
