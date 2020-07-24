import { Op } from 'sequelize';
import Festival from '~/server/models/festival';
import baseController from '~/server/controllers';
import {
  FestivalBelongsToManyArtworks,
  FestivalHasManyDocuments,
  FestivalHasManyImages,
} from '~/server/database/associations';

const baseFileFields = ['fileName', 'fileType', 'url'];

const options = {
  model: Festival,
  fields: ['artworks', 'description', 'images', 'sticker', 'subtitle', 'title'],
  fieldsProtected: ['documents', 'chainId'],
  include: [
    FestivalBelongsToManyArtworks,
    FestivalHasManyDocuments,
    FestivalHasManyImages,
  ],
  associations: [
    {
      association: FestivalHasManyImages,
      destroyCascade: true,
      fields: [
        ...baseFileFields,
        'urlThreshold',
        'urlThresholdThumb',
        'urlThumb',
      ],
    },
    {
      association: FestivalHasManyDocuments,
      destroyCascade: true,
      fields: [...baseFileFields],
    },
    {
      association: FestivalBelongsToManyArtworks,
      destroyCascade: false,
      fields: ['title', 'description', 'images'],
    },
  ],
};

function create(req, res, next) {
  baseController.create(options)(req, res, next);
}

function readAll(req, res, next) {
  baseController.readAll({
    ...options,
    isSearchable: true,
  })(req, res, next);
}

function read(req, res, next) {
  baseController.read(options)(req, res, next);
}

function update(req, res, next) {
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
