import httpStatus from 'http-status';
import { EmptyResultError } from 'sequelize';

import APIError from '~/server/helpers/errors';
import Artwork from '~/server/models/artwork';
import Festival from '~/server/models/festival';
import baseController from '~/server/controllers';
import {
  AnswerBelongsToArtwork,
  AnswerBelongsToProperty,
  ArtworkBelongsToArtist,
  ArtworkBelongsToManyFestivals,
  ArtworkHasManyImages,
  FestivalBelongsToManyArtworks,
  FestivalHasManyDocuments,
  FestivalHasManyImages,
  FestivalHasManyQuestions,
  FestivalHasManyVoteweights,
  QuestionBelongsToArtwork,
  QuestionHasManyAnswers,
  answerFields,
  artistFields,
  artworkFields,
  baseFileFields,
  festivalFields,
  imageFileFields,
  propertyFields,
  questionFields,
  voteweightFields,
} from '~/server/database/associations';
import { filterResponseFields } from '~/server/controllers';
import { respondWithSuccess } from '~/server/helpers/respond';

const options = {
  model: Festival,
  fields: [...festivalFields, 'images', 'artworks', 'voteweights'],
  fieldsProtected: ['documents', 'chainId'],
  include: [
    FestivalBelongsToManyArtworks,
    FestivalHasManyDocuments,
    FestivalHasManyImages,
    FestivalHasManyVoteweights,
  ],
  associations: [
    {
      association: FestivalHasManyImages,
      fields: [...imageFileFields],
    },
    {
      association: FestivalHasManyDocuments,
      fields: [...baseFileFields],
    },
    {
      association: FestivalBelongsToManyArtworks,
      fields: [...artworkFields],
    },
    {
      association: FestivalHasManyVoteweights,
      fields: [...voteweightFields],
    },
  ],
};

const optionsWithQuestions = {
  model: Festival,
  fields: [...festivalFields, 'images', 'questions'],
  associations: [
    {
      association: FestivalHasManyImages,
      fields: [...imageFileFields],
    },
    {
      association: FestivalHasManyQuestions,
      fields: [...questionFields, 'artwork', 'answers'],
      associations: [
        {
          association: QuestionBelongsToArtwork,
          fields: [...artworkFields, 'artist'],
          associations: [
            {
              association: ArtworkBelongsToArtist,
              fields: [...artistFields],
            },
          ],
        },
        {
          association: QuestionHasManyAnswers,
          fields: [...answerFields, 'property', 'artwork'],
          associations: [
            {
              association: AnswerBelongsToArtwork,
              fields: [...artworkFields, 'images'],
              associations: [
                {
                  association: ArtworkHasManyImages,
                  fields: [...imageFileFields],
                },
              ],
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
    FestivalHasManyImages,
    {
      association: FestivalHasManyQuestions,
      include: [
        {
          association: QuestionBelongsToArtwork,
          include: [ArtworkBelongsToArtist],
        },
        {
          association: QuestionHasManyAnswers,
          include: [
            {
              association: AnswerBelongsToArtwork,
              include: [ArtworkHasManyImages],
            },
            AnswerBelongsToProperty,
          ],
        },
      ],
    },
  ],
};

async function getArtworks(req, res, next) {
  baseController.readAll({
    model: Artwork,
    fields: [...artworkFields, 'images', 'artist'],
    associations: [
      {
        association: ArtworkBelongsToArtist,
        fields: [...artistFields],
      },
      {
        association: ArtworkHasManyImages,
        fields: [...imageFileFields],
      },
    ],
    include: [
      {
        association: ArtworkBelongsToManyFestivals,
        where: {
          slug: req.params.slug,
        },
      },
      ArtworkBelongsToArtist,
      ArtworkHasManyImages,
    ],
  })(req, res, next);
}

async function getQuestions(req, res, next) {
  // Request can be via `chainId` or database `id` or `slug`
  const where = {};
  if (Number.isInteger(req.params.idOrChainId)) {
    where.id = req.params.idOrChainId;
  } else if (req.params.idOrChainId.slice(0, 2) === '0x') {
    where.chainId = req.params.idOrChainId;
  } else {
    where.slug = req.params.idOrChainId;
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
  baseController.readAll({
    ...options,
    where: req.locals && req.locals.query,
  })(req, res, next);
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
  getArtworks,
  getQuestions,
  create,
  read,
  readAll,
  update,
  destroy,
};
