import httpStatus from 'http-status';

import APIError from '~/server/helpers/errors';
import Answer from '~/server/models/answer';
import Question from '~/server/models/question';
import logger from '~/server/helpers/logger';

// Get answer chainIds which will be stored publicly on the blockchain
export default async function resolveChainIdsMiddleware(req, res, next) {
  const {
    festivalAnswerIds,
    artworkAnswerIds,
    artworkQuestionId,
    festivalQuestionId,
  } = req.body;

  try {
    // @TODO: Make all of this into one single database query
    const festivalAnswerChainIds = await Promise.all(
      festivalAnswerIds.map(async (answerId) => {
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
      artworkAnswerIds.map(async (answerId) => {
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

    const artworkQuestionChainId = await Question.findByPk(
      artworkQuestionId,
    ).then((question) => question.chainId);

    const festivalQuestion = await Question.findByPk(festivalQuestionId);

    // Store changed vote in locals
    req.locals = req.locals || {};
    req.locals.vote = Object.assign({}, req.body, {
      artworkAnswerChainIds,
      artworkQuestionChainId,
      festivalAnswerChainIds,
      festivalQuestionChainId: festivalQuestion.chainId,
      festivalId: festivalQuestion.festivalId,
    });

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
