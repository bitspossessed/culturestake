import Question from '~/server/models/question';
import baseController from '~/server/controllers';
import {
  AnswerBelongsToArtwork,
  AnswerBelongsToProperty,
  ArtworkBelongsToArtist,
  QuestionBelongsToArtwork,
  QuestionBelongsToFestival,
  QuestionHasManyAnswers,
  artistFields,
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
