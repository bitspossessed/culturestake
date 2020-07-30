import Question from '~/server/models/question';
import baseController from '~/server/controllers';
import {
  AnswerBelongsToArtwork,
  AnswerBelongsToProperty,
  ArtworkBelongsToArtist,
  QuestionHasManyAnswers,
  answerFields,
  artworkFields,
  propertyFields,
  questionFields,
} from '~/server/database/associations';

const options = {
  model: Question,
  fields: [...questionFields, 'answers'],
};

const optionsRead = {
  ...options,
  include: [
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
