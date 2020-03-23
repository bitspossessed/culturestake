const abi = require('ethereumjs-abi');

export async function packBooth(answers, nonce) {
  let encoded = abi.rawEncode(['bytes32[]', 'uint256'], [answers, nonce]);
  return `0x${encoded.toString('hex')}`;
}

export async function packVote(answers, votes) {
  let encoded = abi.rawEncode(['bytes32[]', 'uint256[]'], [answers, votes]);
  return `0x${encoded.toString('hex')}`;
}
