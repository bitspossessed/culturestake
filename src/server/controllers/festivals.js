import httpStatus from 'http-status';
import { EmptyResultError } from 'sequelize';

import APIError from '~/server/helpers/errors';
import Festival from '~/server/models/festival';
import baseController from '~/server/controllers';
import {
  AnswerBelongsToArtwork,
  AnswerBelongsToProperty,
  FestivalBelongsToManyArtworks,
  FestivalHasManyDocuments,
  FestivalHasManyImages,
  FestivalHasManyQuestions,
  QuestionBelongsToArtwork,
  QuestionHasManyAnswers,
  answerFields,
  artworkFields,
  baseFileFields,
  propertyFields,
  festivalFields,
  imageFileFields,
  questionFields,
} from '~/server/database/associations';
import { filterResponseFields } from '~/server/controllers';
import { respondWithSuccess } from '~/server/helpers/respond';

const options = {
  model: Festival,
  fields: [...festivalFields],
  fieldsProtected: ['documents', 'chainId'],
  include: [
    FestivalBelongsToManyArtworks,
    FestivalHasManyDocuments,
    FestivalHasManyImages,
  ],
  associations: [
    {
      association: FestivalHasManyImages,
      destroyCascade: true,
      fields: [...imageFileFields],
    },
    {
      association: FestivalHasManyDocuments,
      destroyCascade: true,
      fields: [...baseFileFields],
    },
    {
      association: FestivalBelongsToManyArtworks,
      destroyCascade: false,
      fields: [...artworkFields],
    },
  ],
};

const optionsWithQuestions = {
  model: Festival,
  fields: [...festivalFields, 'questions'],
  associations: [
    {
      association: FestivalHasManyQuestions,
      fields: [...questionFields, 'artwork', 'answers'],
      associations: [
        {
          association: QuestionBelongsToArtwork,
          fields: [...artworkFields],
        },
        {
          association: QuestionHasManyAnswers,
          fields: [...answerFields, 'property', 'artwork'],
          associations: [
            {
              association: AnswerBelongsToArtwork,
              fields: [...artworkFields],
            },
            {
              association: AnswerBelongsToProperty,
              fields: [...propertyFields],
            },
          ],
        },
      ],
    },
  ],
  include: [
    {
      association: FestivalHasManyQuestions,
      include: [
        {
          association: QuestionBelongsToArtwork,
        },
        {
          association: QuestionHasManyAnswers,
          include: [AnswerBelongsToArtwork, AnswerBelongsToProperty],
        },
      ],
    },
  ],
};

async function getQuestions(req, res, next) {
  // Request can be via `chainId` or database `id`
  const where = {};
  if (Number.isInteger(req.params.idOrChainId)) {
    where.id = req.params.idOrChainId;
  } else {
    where.chainId = req.params.idOrChainId;
  }

  try {
    const data = await Festival.findOne({
      rejectOnEmpty: true,
      include: optionsWithQuestions.include,
      where,
    });

    respondWithSuccess(
      res,
      filterResponseFields(req, data, optionsWithQuestions),
    );
  } catch (error) {
    if (error instanceof EmptyResultError) {
      next(new APIError(httpStatus.NOT_FOUND));
    } else {
      next(error);
    }
  }
}

function create(req, res, next) {
  baseController.create(options)(req, res, next);
}

function readAll(req, res, next) {
  baseController.readAll(options)(req, res, next);
}

function read(req, res, next) {
  baseController.read(options)(req, res, next);
}

function update(req, res, next) {
  baseController.update(options)(req, res, next);
}

function destroy(req, res, next) {
  baseController.destroy(options)(req, res, next);
}

export default {
  getQuestions,
  create,
  read,
  readAll,
  update,
  destroy,
};
