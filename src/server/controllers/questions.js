import Question from '~/server/models/question';
import baseController from '~/server/controllers';
import {
  QuestionHasManyAnswers,
  QuestionBelongsToFestival,
} from '~/server/database/associations';

const options = {
  model: Question,
  fields: ['title', 'slug', 'chainId', 'answers'],
  fieldsProtected: ['artworkId', 'festivalId'],
};

const answerFields = ['type', 'artworkId', 'propertyId'];
const festivalfields = [
  'chainId',
  'description',
  'sticker',
  'subtitle',
  'title',
];

const optionsRead = {
  ...options,
  include: [QuestionHasManyAnswers, QuestionBelongsToFestival],
  associations: [
    {
      association: QuestionHasManyAnswers,
      destroyCascade: true,
      fields: [...answerFields],
    },
    {
      association: QuestionBelongsToFestival,
      destroyCascade: false,
      fields: [...festivalfields],
    },
  ],
};

function create(req, res, next) {
  baseController.create(options)(req, res, next);
}

function readAll(req, res, next) {
  baseController.readAll(optionsRead)(req, res, next);
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
  create,
  read,
  readAll,
  update,
  destroy,
};
