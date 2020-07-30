import Question from '~/server/models/question';
import baseController from '~/server/controllers';
import {
<<<<<<< HEAD
  QuestionHasManyAnswers,
  QuestionBelongsToFestival,
  QuestionBelongsToArtwork,
=======
  AnswerBelongsToArtwork,
  AnswerBelongsToProperty,
  ArtworkBelongsToArtist,
  QuestionHasManyAnswers,
  answerFields,
  artworkFields,
  propertyFields,
  questionFields,
>>>>>>> aa041de1b8e3da9dc7e886dce495ba1400bebd4b
} from '~/server/database/associations';

const options = {
  model: Question,
<<<<<<< HEAD
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
=======
  fields: [...questionFields, 'answers'],
>>>>>>> aa041de1b8e3da9dc7e886dce495ba1400bebd4b
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
<<<<<<< HEAD
    QuestionHasManyAnswers,
    QuestionBelongsToFestival,
    QuestionBelongsToArtwork,
=======
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
>>>>>>> aa041de1b8e3da9dc7e886dce495ba1400bebd4b
  ],
  associations: [
    {
      association: QuestionHasManyAnswers,
<<<<<<< HEAD
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
=======
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
>>>>>>> aa041de1b8e3da9dc7e886dce495ba1400bebd4b
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
