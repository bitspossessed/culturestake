import httpStatus from 'http-status';

import APIError from '~/server/helpers/errors';
import logger from '~/server/helpers/logger';

async function checkHotspot(vote) {
  return true;
}

async function checkOrganisation(vote) {
  return true;
}

async function checkLocation(vote) {
  return true;
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
