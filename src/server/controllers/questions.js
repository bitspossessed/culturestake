import httpStatus from 'http-status';
import { EmptyResultError } from 'sequelize';
import stringify from 'csv-stringify';

import APIError from '~/server/helpers/errors';
import Question from '~/server/models/question';
import Vote from '~/server/models/vote';
import baseController from '~/server/controllers';
import {
  QuestionHasManyAnswers,
  QuestionBelongsToFestival,
  AnswerBelongsToProperty,
  AnswerBelongsToArtwork,
  QuestionBelongsToArtwork,
  ArtworkBelongsToArtist,
  answerFields,
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
      fields: [...answerFields],
      associations: [
        {
          association: AnswerBelongsToArtwork,
          fields: [...artworkFields],
          associations: [
            {
              association: ArtworkBelongsToArtist,
              fields: [...artworkFields],
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
      });

      res.header('Content-Type', 'text/csv');
      res.attachment(`votes-${question.slug}.csv`);

      stringify(
        (votes || []).map((instance) => instance.get({ plain: true })),
        { header: true },
      ).pipe(res);
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
