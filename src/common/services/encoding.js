const abi = require('ethereumjs-abi');

export const boothTypes = ['bytes32[]', 'uint256'];

export const voteTypes = ['bytes32[]', 'uint256[]'];

export function packBooth(answers, nonce) {
  return pack(boothTypes, [answers, nonce]);
}

export function packVote(answers, votes) {
  return pack(voteTypes, [answers, votes]);
}

export function pack(types, args) {
  let encoded = abi.rawEncode(types, args);
  return `0x${encoded.toString('hex')}`;
}
