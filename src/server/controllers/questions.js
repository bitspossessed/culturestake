import httpStatus from 'http-status';
import { EmptyResultError } from 'sequelize';
import stringify from 'csv-stringify';

import APIError from '~/server/helpers/errors';
import Question from '~/server/models/question';
import Vote from '~/server/models/vote';
import Artwork from '~/server/models/artwork';
import Property from '~/server/models/property';
import Voteweight from '~/server/models/voteweight';
import Answer from '~/server/models/answer';
import { accumulate } from '~/server/middlewares/applyVoteweights';
import { quadratify } from '~/common/utils/math';
import baseController from '~/server/controllers';
import {
  QuestionHasManyAnswers,
  QuestionBelongsToFestival,
  AnswerBelongsToProperty,
  AnswerBelongsToArtwork,
  QuestionBelongsToArtwork,
  ArtworkBelongsToArtist,
  answerFields,
  artistFields,
  artworkFields,
  festivalFields,
  propertyFields,
  questionFields,
} from '~/server/database/associations';

const options = {
  model: Question,
  fields: [...questionFields, 'answers', 'festival', 'artwork'],
};

const optionsRead = {
  ...options,
  include: [
    QuestionBelongsToFestival,
    QuestionBelongsToArtwork,
    {
      association: QuestionHasManyAnswers,
      include: [
        {
          association: AnswerBelongsToArtwork,
          include: ArtworkBelongsToArtist,
        },
        AnswerBelongsToProperty,
      ],
    },
  ],
  associations: [
    {
      association: QuestionBelongsToFestival,
      destroyCascade: false,
      fields: [...festivalFields],
    },
    {
      association: QuestionBelongsToArtwork,
      destroyCascade: false,
      fields: ['title'],
    },
    {
      association: QuestionHasManyAnswers,
      fields: [...answerFields, 'artwork'],
      associations: [
        {
          association: AnswerBelongsToArtwork,
          fields: [...artworkFields, 'artist'],
          associations: [
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
};

async function getVotes(req, res, next) {
  if (req.get('Content-Type') === 'text/csv') {
    const { resource: question } = req.locals;

    const fullQuestion = await Question.findOne({
      rejectOnEmpty: true,
      where: { id: question.id },
      include: [
        {
          model: Answer,
          as: 'answers',
          include: [
            {
              model: Artwork,
            },
            {
              model: Property,
            },
          ],
        },
      ],
    });

    try {
      const votes = await Vote.findAll({
        rejectOnEmpty: true,
        where: {
          ...(question.type === 'festival'
            ? { festivalQuestionChainId: question.chainId }
            : undefined),
          ...(question.type === 'artwork'
            ? { artworkQuestionChainId: question.chainId }
            : undefined),
        },
        include: [
          {
            model: Voteweight,
            as: 'voteweights',
          },
        ],
      });

      const type = question.type === 'festival' ? 'artwork' : 'property';
      const answerName =
        type === 'property'
          ? 'artworkAnswerChainIds'
          : 'festivalAnswerChainIds';
      const voteTokenName =
        type === 'property' ? 'artworkVoteTokens' : 'festivalVoteTokens';

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
        vote[answerName].map((answer, index) => {
          const answerTitle = fullQuestion.answers[index][type].title;
          parsed[`${answerTitle} - vibe credits`] = vote[voteTokenName][index];
          const weight = accumulate(
            vote.voteweights.map((weight) => weight.multiplier),
          );
          parsed[`${answerTitle} - votes`] = quadratify(
            vote[voteTokenName][index] * weight,
          );
        });
        return parsed;
      });

      res.header('Content-Type', 'text/csv');
      res.attachment(`votes-${question.slug}.csv`);

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

function create(req, res, next) {
  baseController.create(options)(req, res, next);
}

function readAll(req, res, next) {
  if (req.query.orderKey && req.query.orderKey.includes('.')) {
    req.query.assoc = req.query.orderKey.split('.')[0];
    req.query.orderKey = req.query.orderKey.split('.')[1];
  }
  baseController.readAll({
    ...optionsRead,
    where: req.locals && req.locals.query,
  })(req, res, next);
}

function read(req, res, next) {
  baseController.read(optionsRead)(req, res, next);
}

async function update(req, res, next) {
  baseController.update(options)(req, res, next);
}

function destroy(req, res, next) {
  baseController.destroy(options)(req, res, next);
}

export default {
  getVotes,
  create,
  read,
  readAll,
  update,
  destroy,
};
