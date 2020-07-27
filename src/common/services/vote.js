import web3 from '~/common/services/web3';
import { packVote, packBooth } from '~/common/services/encoding';

const VOTE_DATA_FESTIVAL_TOKEN = '|';
const VOTE_DATA_SEPARATOR = '/';

export async function getBoothNonce() {
  // @TODO
}

export function signBooth({ festivalAnswerIds, privateKey, nonce }) {
  return web3.eth.accounts.sign(packBooth(festivalAnswerIds, nonce), privateKey)
    .signature;
}

export function signAudienceVote({
  artworkAnswerIds,
  artworkVoteTokens,
  festivalAnswerIds,
  festivalVoteTokens,
  privateKey,
}) {
  return web3.eth.accounts.sign(
    packVote(
      festivalAnswerIds,
      festivalVoteTokens,
      artworkAnswerIds,
      artworkVoteTokens,
    ),
    privateKey,
  ).signature;
}

export function encodeVoteData({
  festivalAnswerIds,
  festivalQuestionId,
  nonce,
  signature,
}) {
  return [
    ...festivalAnswerIds,
    VOTE_DATA_FESTIVAL_TOKEN,
    nonce,
    festivalQuestionId,
    signature,
  ].join(VOTE_DATA_SEPARATOR);
}

export function decodeVoteData(code) {
  try {
    const codeParts = code.split(VOTE_DATA_FESTIVAL_TOKEN);

    const festivalAnswerIds = codeParts[0].split(VOTE_DATA_SEPARATOR);

    const [nonce, festivalQuestionId, signature] = codeParts[1].split(
      VOTE_DATA_SEPARATOR,
    );

    if (isNaN(nonce)) {
      throw new Error('Invalid nonce');
    }

    if (isNaN(festivalQuestionId)) {
      throw new Error('Invalid festivalQuestionId');
    }

    if (!web3.utils.isHexStrict(signature) || signature.length !== 132) {
      throw new Error('Invalid signature format');
    }

    if (festivalAnswerIds.length === 0) {
      throw new Error('No answerIds found');
    }

    return {
      festivalAnswerIds,
      festivalQuestionId,
      nonce,
      signature,
    };
  } catch {
    throw new Error('Could not decode vote data');
  }
}
