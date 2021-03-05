import httpStatus from 'http-status';

import APIError from '~/server/helpers/errors';
import logger from '~/server/helpers/logger';
import Voteweight from '~/server/models/voteweight';

async function apply(vote, multiplier) {
  vote.festivalVoteTokens = vote.festivalVoteTokens.map(
    (tokens) => tokens * multiplier,
  );
  vote.artworkVoteTokens = vote.artworkVoteTokens.map(
    (tokens) => tokens * multiplier,
  );
}

function accumulate(weights) {
  const negativeweights = weights.reduce((a, b) => {
    if (b < 1) return a + b;
    return a;
  }, 0);
  const postiveweights = weights.reduce((a, b) => {
    if (b > 1) return a + (b - 1);
    return a;
  }, 1);
  const sum = 1 + postiveweights - (1 + negativeweights);
  return sum ? sum : 1;
}

async function checkHotspot(vote, accumulatedWeights) {
  const voteweight = await Voteweight.findOne({
    where: {
      festivalId: vote.festivalId,
      hotspot: vote.boothAddress,
    },
  });
  if (!voteweight) return;
  vote.voteweights.push(voteweight.id);
  accumulatedWeights.push(voteweight.strength);
}

async function checkOrganisation(vote, accumulatedWeights) {
  if (!vote.organisationId) return;
  const voteweight = await Voteweight.findOne({
    where: {
      festivalId: vote.festivalId,
      organisationId: vote.organisationId,
    },
  });
  if (!voteweight) return;
  vote.voteweights.push(voteweight.id);
  accumulatedWeights.push(voteweight.strength);
}

async function checkLocation(vote, accumulatedWeights) {
  return vote;
}

export default async function applyVoteweightsMiddleware(req, res, next) {
  const { vote } = req.locals;

  vote.voteweights = [];
  const accumulatedWeights = [];

  try {
    for (const voteweightType of [
      checkLocation,
      checkOrganisation,
      checkHotspot,
    ]) {
      await voteweightType(vote, accumulatedWeights);
    }

    const weight = accumulate(accumulatedWeights);
    apply(vote, weight);

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
