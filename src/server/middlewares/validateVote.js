import httpStatus from 'http-status';

import { isSignatureValid } from '~/server/services/crypto';
import { packVote, packBooth } from '~/common/services/encoding';
import APIError from '~/server/helpers/errors';

export default function(req, res, next) {
  const vote = req.body;
  if (
    !isSignatureValid(
      packVote(vote.answers, vote.voteTokens),
      vote.signature,
      vote.sender,
    ) ||
    !isSignatureValid(
      packBooth(vote.answers, vote.nonce),
      vote.boothSignature,
      vote.booth,
    )
  ) {
    throw new APIError(httpStatus.BAD_REQUEST);
  }
  if (vote.answers.length !== vote.voteTokens.length) {
    throw new APIError(httpStatus.BAD_REQUEST);
  }
  // voting booth is active on festival
  // all answers are active
  // voteTokens do not sum to more than max votes
  // sender has not voted on question yet
  // no duplicates in answers array
  next();
};
