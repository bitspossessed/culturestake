import Question from '~/server/models/question';
import baseController from '~/server/controllers';
import {
  QuestionHasManyAnswers,
  QuestionBelongsToFestival,
  QuestionBelongsToArtwork,
} from '~/server/database/associations';

const options = {
  model: Question,
  fields: [
    'title',
    'slug',
    'chainId',
    'answers',
    'festival',
    'festivalId',
    'artworkId',
    'artwork',
  ],
  fieldsProtected: [],
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
  include: [
    QuestionHasManyAnswers,
    QuestionBelongsToFestival,
    QuestionBelongsToArtwork,
  ],
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
    {
      association: QuestionBelongsToArtwork,
      destroyCascade: false,
      fields: ['title'],
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
