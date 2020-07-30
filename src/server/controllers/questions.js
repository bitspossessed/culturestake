import Question from '~/server/models/question';
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
  propertyFields,
  questionFields,
} from '~/server/database/associations';

const options = {
  model: Question,
  fields: [...questionFields, 'answers'],
};

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
      include: [AnswerBelongsToArtwork, AnswerBelongsToProperty],
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
