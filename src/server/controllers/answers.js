import Answer from '~/server/models/answer';
import baseController from '~/server/controllers';
import {
  AnswerBelongsToArtwork,
  AnswerBelongsToProperty,
  AnswerBelongsToQuestion,
} from '~/server/database/associations';

import { answerFields } from '~/server/database/associations';

const options = {
  model: Answer,
  fields: [...answerFields, 'artwork', 'property', 'question'],
  fieldsProtected: ['chainId'],
};

const readOptions = {
  ...options,

  include: [
    AnswerBelongsToProperty,
    AnswerBelongsToArtwork,
    AnswerBelongsToQuestion,
  ],
  associations: [
    {
      association: AnswerBelongsToProperty,
      destroyCascade: false,
      fields: ['title'],
    },
    {
      association: AnswerBelongsToArtwork,
      destroyCascade: false,
      fields: ['title'],
    },
    {
      association: AnswerBelongsToQuestion,
      destroyCascade: false,
      fields: ['title'],
      fieldsProtected: ['chainId'],
    },
  ],
};

function create(req, res, next) {
  baseController.create(options)(req, res, next);
}

function readAll(req, res, next) {
  baseController.readAll({
    ...readOptions,
    where: req.locals && req.locals.query,
  })(req, res, next);
}

function read(req, res, next) {
  baseController.read(readOptions)(req, res, next);
}

function destroy(req, res, next) {
  baseController.destroy(options)(req, res, next);
}

export default {
  create,
  read,
  readAll,
  destroy,
};
