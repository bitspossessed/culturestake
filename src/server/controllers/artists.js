import Artist from '~/server/models/artist';
import baseController from '~/server/controllers';
import {
  ArtistHasManyArtworks,
  ArtistHasManyImages,
  artistFields,
  artworkFields,
  imageFileFields,
  baseFileFields,
} from '~/server/database/associations';

const options = {
  model: Artist,
  fields: [...artistFields, 'artworks', 'images'],
  include: [ArtistHasManyImages],
  associations: [
    {
      association: ArtistHasManyImages,
      destroyCascade: true,
      fields: [...imageFileFields],
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
  baseController.read({
    ...options,
    include: [ArtistHasManyImages, ArtistHasManyArtworks],
    associations: [
      {
        association: ArtistHasManyImages,
        destroyCascade: true,
        fields: [
          ...baseFileFields,
          'urlThreshold',
          'urlThresholdThumb',
          'urlThumb',
        ],
      },
      {
        association: ArtistHasManyArtworks,
        destroyCascade: false,
        fields: [...artworkFields],
      },
    ],
  })(req, res, next);
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
