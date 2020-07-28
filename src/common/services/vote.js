import web3 from '~/common/services/web3';
import { packVote, packBooth } from '~/common/services/encoding';

const VOTE_DATA_FESTIVAL_TOKEN = '-';
const VOTE_DATA_SEPARATOR = '|';
const VOTE_DATA_SIGNATURE_TOKEN = 'e1ec7';

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
    web3.utils.utf8ToHex(
      [
        festivalAnswerIds.join(VOTE_DATA_SEPARATOR),
        VOTE_DATA_FESTIVAL_TOKEN,
        [nonce, festivalQuestionId].join(VOTE_DATA_SEPARATOR),
      ].join(''),
    ),
    VOTE_DATA_SIGNATURE_TOKEN,
    signature.slice(2),
  ].join('');
}

export function decodeVoteData(code) {
  try {
    if (!code) {
      throw new Error('No code given');
    }

    if (!web3.utils.isHexStrict(code)) {
      throw new Error('Invalid code');
    }

    const parts = code.toLowerCase().split(VOTE_DATA_SIGNATURE_TOKEN);
    const meta = web3.utils.hexToUtf8(parts[0]);
    const metaParts = meta.split(VOTE_DATA_FESTIVAL_TOKEN);

    const festivalAnswerIds = metaParts[0]
      .split(VOTE_DATA_SEPARATOR)
      .map((value) => {
        if (isNaN(value)) {
          throw new Error('Invalid festivalAnswerId');
        }

        return parseInt(value, 10);
      });

    const [nonce, festivalQuestionId] = metaParts[1]
      .split(VOTE_DATA_SEPARATOR)
      .map((value) => {
        return parseInt(value, 10);
      });

    const signature = `0x${parts[1]}`;

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
  } catch (error) {
    throw new Error('Could not decode vote data');
  }
}
