import httpStatus from 'http-status';
import { EmptyResultError } from 'sequelize';
import stringify from 'csv-stringify';

import { getFestival } from '~/common/services/contracts/festivals';
import APIError from '~/server/helpers/errors';
import Artwork from '~/server/models/artwork';
import Festival from '~/server/models/festival';
import Voteweight from '~/server/models/voteweight';
import Vote from '~/server/models/vote';
import Answer from '~/server/models/answer';
import Question from '~/server/models/question';
import { accumulate } from '~/server/middlewares/applyVoteweights';
import { quadratify } from '~/common/utils/math';
import logger from '~/server/helpers/logger';
import baseController from '~/server/controllers';
import {
  AnswerBelongsToArtwork,
  AnswerBelongsToProperty,
  ArtworkBelongsToArtist,
  ArtworkBelongsToManyFestivals,
  ArtworkHasManyImages,
  FestivalBelongsToManyArtworks,
  FestivalHasOneQuestion,
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
  fields: [
    ...festivalFields,
    'images',
    'artworks',
    'online',
    'voteweights',
    'question',
  ],
  fieldsProtected: ['documents', 'chainId'],
  include: [
    FestivalHasManyDocuments,
    FestivalHasManyImages,
    {
      association: FestivalBelongsToManyArtworks,
      include: [ArtworkBelongsToArtist],
    },
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
      fields: [...artworkFields, 'artist'],
      associations: [
        {
          association: ArtworkBelongsToArtist,
          fields: [...artistFields],
        },
      ],
    },
  ],
};

const optionsCreate = {
  ...options,
  include: [FestivalHasOneQuestion],
};

const optionsRead = {
  ...options,
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
  fields: [...festivalFields, 'images', 'questions', 'startTime', 'endTime'],
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
              fields: [...artworkFields, 'images', 'artist'],
              associations: [
                {
                  association: ArtworkHasManyImages,
                  fields: [...imageFileFields],
                },
                {
                  association: ArtworkBelongsToArtist,
                  fields: [...artistFields],
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
              include: [ArtworkHasManyImages, ArtworkBelongsToArtist],
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

async function getVotes(req, res, next) {
  if (req.get('Content-Type') === 'text/csv') {
    const { slug } = req.params;
    const { resource } = req.locals;

    try {
      const question = await Question.findOne({
        rejectOnEmpty: true,
        where: { festivalId: resource.id, artworkId: null },
        include: [
          {
            model: Answer,
            as: 'answers',
            include: [
              {
                model: Artwork,
              },
            ],
          },
        ],
      });

      const votes = await Vote.findAll({
        rejectOnEmpty: true,
        where: { festivalQuestionChainId: question.chainId },
        include: [
          {
            model: Voteweight,
            as: 'voteweights',
          },
        ],
      });

      res.header('Content-Type', 'text/csv');
      res.attachment(`votes-${slug}.csv`);

      const parsedVotes = votes.map((vote) => {
        const parsed = {
          senderAddress: vote.senderAddress,
          location: vote.location,
          question: question.title,
          voteweights:
            vote.voteweights.length > 0
              ? vote.voteweights.map((weight) => `${weight.name}, `)
              : '',
        };
        vote.festivalAnswerChainIds.map((answer, index) => {
          const answerTitle = question.answers[index].artwork.title;
          parsed[`${answerTitle} - vibe credits`] =
            vote.festivalVoteTokens[index];
          const weight = accumulate(
            vote.voteweights.map((weight) => weight.multiplier),
          );
          parsed[`${answerTitle} - votes`] = quadratify(
            vote.festivalVoteTokens[index] * weight,
          );
        });
        return parsed;
      });

      stringify(parsedVotes || [], { header: true }).pipe(res);
    } catch (error) {
      if (error instanceof EmptyResultError) {
        next(new APIError(httpStatus.NOT_FOUND));
      } else {
        next(error);
      }
    }
  } else {
    next(new APIError(httpStatus.NOT_FOUND));
  }
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

    const { startTime, endTime } = await getFestival(data.chainId);

    const filtered = filterResponseFields(req, data, optionsWithQuestions);

    respondWithSuccess(res, { ...filtered, startTime, endTime });
  } catch (error) {
    if (error instanceof EmptyResultError) {
      next(new APIError(httpStatus.NOT_FOUND));
    } else {
      next(error);
    }
  }
}

async function getFestivalQuestion(req) {
  const where = {};

  try {
    if (!req.locals || !req.locals.resource) {
      return {};
    }
    where.festivalId = req.locals.resource.id;
    where.type = 'festival';

    console.log(where)

    const data = await Question.findAll({
      rejectOnEmpty: true,
      where,
    });

    console.log(data)

    if (data.length > 1) {
      throw new Error();
    }

    return data[0];
  } catch (error) {
    console.log(error)
    logger.error(
      `Found abnormal question data for festival ${req.locals.resource.id}`,
    );
    return {};
  }
}

function create(req, res, next) {
  baseController.create(optionsCreate, { include: true })(req, res, next);
}

function readAll(req, res, next) {
  baseController.readAll({
    ...optionsRead,
    where: req.locals && req.locals.query,
  })(req, res, next);
}

async function read(req, res, next) {
  const festivalQuestion = await getFestivalQuestion(req);
  baseController.read({
    ...optionsRead,
    manuallyAppend: {
      question: { data: festivalQuestion, fields: [...questionFields] },
    },
  })(req, res, next);
}

function update(req, res, next) {
  baseController.update(options)(req, res, next);
}

function destroy(req, res, next) {
  baseController.destroy(options)(req, res, next);
}

export default {
  getArtworks,
  getVotes,
  getQuestions,
  create,
  read,
  readAll,
  update,
  destroy,
};
