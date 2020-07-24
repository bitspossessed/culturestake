import Artwork from '~/server/models/artwork';
import baseController from '~/server/controllers';

import {
  ArtworkHasManyImages,
  imageFileFields,
} from '~/server/database/associations';

const options = {
  model: Artwork,
  fields: ['title', 'description', 'barcode', 'artistId'],
  include: [ArtworkHasManyImages],
  associations: [
    {
      association: ArtworkHasManyImages,
      destroyCascade: true,
      fields: [
        ...imageFileFields,
      ],
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
