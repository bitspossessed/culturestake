import httpStatus from 'http-status';

import APIError from '~/server/helpers/errors';
import logger from '~/server/helpers/logger';
import Voteweight from '~/server/models/voteweight';
import db from '~/server/database';

export async function applyWeight(vote, multiplier) {
  vote.festivalVoteTokens = vote.festivalVoteTokens.map((tokens) => {
    return Math.floor(tokens * multiplier);
  });
  vote.artworkVoteTokens = vote.artworkVoteTokens.map((tokens) => {
    return Math.floor(tokens * multiplier);
  });
}

export function accumulate(weights) {
  const sum = weights.reduce((a, b) => a * b, 1);
  return sum;
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
  accumulatedWeights.push(voteweight.multiplier);
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
  accumulatedWeights.push(voteweight.multiplier);
}

async function checkLocation(vote, accumulatedWeights) {
  if (!vote.longitude || !vote.latitude) return;
  const sql = `SELECT id, name, multiplier FROM voteweights
    WHERE (
      ST_DWithin(
        ST_SetSRID(ST_Point(${vote.longitude}, ${vote.latitude}),4326),
        voteweights.location,
        voteweights.radius
      )
    AND "festivalId"=${parseInt(vote.festivalId)});`;
  const [voteweights] = await db.query(sql);
  if (voteweights.length === 0) return;
  voteweights.map((weight) => {
    vote.voteweights.push(weight.id);
    accumulatedWeights.push(weight.multiplier);
  });
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
    applyWeight(vote, weight);

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
