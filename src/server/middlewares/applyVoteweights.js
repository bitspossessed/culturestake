import httpStatus from 'http-status';

import APIError from '~/server/helpers/errors';
import logger from '~/server/helpers/logger';
import Voteweight from '~/server/models/voteweight';

async function apply(vote, multiplier) {
  vote.festivalVoteTokens.map((tokens) => tokens * multiplier);
  vote.artworkVoteTokens.map((tokens) => tokens * multiplier);
}

async function checkHotspot(vote) {
  return vote;
}

async function checkOrganisation(vote) {
  if (vote.organisation) {
    const voteweight = await Voteweight.findOne({
      where: {
        festivalId: vote.festivalId,
        organisationId: vote.organisationId,
      },
    });
    if (!voteweight) return;
    apply(vote, voteweight.strength);
  }
}

async function checkLocation(vote) {
  return vote;
}

export default async function applyVoteweightsMiddleware(req, res, next) {
  const { vote } = req.locals;

  try {
    for (const voteweightType of [
      checkLocation,
      checkOrganisation,
      checkHotspot,
    ]) {
      await voteweightType(vote);
    }

    next();
  } catch (error) {
    logger.verbose(error);

    if (process.env.NODE_ENV === 'production') {
      next(new APIError(httpStatus.UNPROCESSABLE_ENTITY));
    } else {
      next(new APIError(httpStatus.UNPROCESSABLE_ENTITY, error.message));
    }
  }
}
