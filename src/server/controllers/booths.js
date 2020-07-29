import httpStatus from 'http-status';
import { EmptyResultError } from 'sequelize';

import APIError from '~/server/helpers/errors';
import Festival from '~/server/models/festival';
import {
  AnswerBelongsToArtwork,
  AnswerBelongsToProperty,
  ArtworkBelongsToArtist,
  FestivalHasManyQuestions,
  QuestionBelongsToArtwork,
  QuestionHasManyAnswers,
} from '~/server/database/associations';
import { filterResponseFields } from '~/server/controllers';
import { respondWithSuccess } from '~/server/helpers/respond';

const artworkFields = ['barcode', 'title', 'description', 'artistId', 'artist'];

const options = {
  model: Festival,
  fields: [
    'description',
    'images',
    'questions',
    'sticker',
    'subtitle',
    'title',
  ],
  associations: [
    {
      association: FestivalHasManyQuestions,
      fields: ['answers', 'title'],
      associations: [
        {
          association: QuestionBelongsToArtwork,
          fields: [...artworkFields],
        },
        {
          association: QuestionHasManyAnswers,
          fields: [
            'artwork',
            'artworkId',
            'property',
            'propertyId',
            'questionId',
          ],
          associations: [
            {
              association: AnswerBelongsToArtwork,
              fields: [...artworkFields],
              associations: [
                {
                  association: ArtworkBelongsToArtist,
                  fields: ['name', 'bio'],
                },
              ],
            },
            {
              association: AnswerBelongsToProperty,
              fields: ['title'],
            },
          ],
        },
      ],
    },
  ],
  include: [
    {
      association: FestivalHasManyQuestions,
      include: [
        {
          association: QuestionBelongsToArtwork,
        },
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
    },
  ],
};

async function getArtworks(req, res, next) {
  try {
    const data = await Festival.findOne({
      rejectOnEmpty: true,
      where: {
        chainId: req.params.festivalChainId,
      },
      include: options.include,
    });

    respondWithSuccess(res, filterResponseFields(req, data, options));
  } catch (error) {
    if (error instanceof EmptyResultError) {
      next(new APIError(httpStatus.NOT_FOUND));
    } else {
      next(error);
    }
  }
}

export default {
  getArtworks,
};
