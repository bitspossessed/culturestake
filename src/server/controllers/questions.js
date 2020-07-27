import Question from '~/server/models/question';
import baseController from '~/server/controllers';
import { QuestionHasManyAnswers } from '~/server/database/associations';

const options = {
  model: Question,
  fields: ['title', 'slug', 'answers'],
  fieldsProtected: ['chainId', 'artworkId', 'festivalId'],
};

const optionsRead = {
  ...options,
  include: [QuestionHasManyAnswers],
  associations: [
    {
      association: QuestionHasManyAnswers,
      fields: ['type'],
      fieldsProtected: ['chainId', 'artworkId', 'propertyId'],
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
