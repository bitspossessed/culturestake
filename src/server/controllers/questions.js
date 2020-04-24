import Question from '~/server/models/question';
import baseController from '~/server/controllers';
import { QuestionHasManyAnswers } from '~/server/database/associations';

const answerFields = ['type', 'artworkId', 'propertyId'];

const options = {
  model: Question,
  fields: ['title', 'address', 'answers'],
  fieldsProtected: [],
  include: [QuestionHasManyAnswers],
  associations: [
    {
      association: QuestionHasManyAnswers,
      destroyCascade: true,
      fields: [...answerFields],
    },
  ],
};

function create(req, res, next) {
  baseController.create(options)(req, res, next);
}

function readAll(req, res, next) {
  baseController.readAll(options)(req, res, next);
}

function read(req, res, next) {
  baseController.read(options)(req, res, next);
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
