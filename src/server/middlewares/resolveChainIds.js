import httpStatus from 'http-status';

import APIError from '~/server/helpers/errors';
import Answer from '~/server/models/answer';
import logger from '~/server/helpers/logger';

// Get answer chainIds which will be stored publicly on the blockchain
export default async function resolveChainIdsMiddleware(req, res, next) {
  const { body } = req;

  try {
    // @TODO: Make all of this into one single database query
    const festivalAnswerChainIds = await Promise.all(
      body.festivalAnswerIds.map(async (answerId) => {
        const answer = await Answer.findByPk(answerId);

        if (!answer) {
          throw Error(`Could not find answer ${answerId} in database`);
        }

        // Festival answers can only be related to artworks
        if (answer.propertyId) {
          throw Error(`Answer ${answerId} is only for properties`);
        }

        return answer.chainId;
      }),
    );

    const artworkAnswerChainIds = await Promise.all(
      body.artworkAnswerIds.map(async (answerId) => {
        const answer = await Answer.findByPk(answerId);

        if (!answer) {
          throw Error(`Could not find answer ${answerId} in database`);
        }

        // Artwork answers can only be related to properties
        if (answer.artworkId) {
          throw Error(`Answer ${answerId} is only for artworks`);
        }

        return answer.chainId;
      }),
    );

    // Store changed vote in locals
    req.locals = req.locals || {};
    req.locals.vote = Object.assign({}, body, {
      festivalAnswerChainIds,
      artworkAnswerChainIds,
    });

    next();
  } catch (error) {
    logger.verbose(error);
    next(new APIError(httpStatus.UNPROCESSABLE_ENTITY, error.message));
  }
}
