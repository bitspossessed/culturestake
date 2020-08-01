import Artwork from '~/server/models/artwork';
import baseController from '~/server/controllers';
import {
  ArtworkBelongsToArtist,
  ArtworkBelongsToManyFestivals,
  ArtworkHasManyImages,
  artworkFields,
  festivalFields,
  imageFileFields,
} from '~/server/database/associations';

const options = {
  model: Artwork,
  fields: [...artworkFields, 'images'],
  include: [ArtworkHasManyImages],
  associations: [
    {
      association: ArtworkHasManyImages,
      destroyCascade: true,
      fields: [...imageFileFields],
    },
  ],
};

const optionsRead = {
  ...options,
  fields: [...artworkFields, 'artist', 'festivals', 'images'],
  include: [
    ArtworkHasManyImages,
    ArtworkBelongsToArtist,
    ArtworkBelongsToManyFestivals,
  ],
  associations: [
    {
      association: ArtworkHasManyImages,
      destroyCascade: true,
      fields: [...imageFileFields],
    },
    {
      association: ArtworkBelongsToArtist,
      destroyCascade: false,
      fields: [...artworkFields],
    },
    {
      association: ArtworkBelongsToManyFestivals,
      destroyCascade: false,
      fields: [...festivalFields],
    },
  ],
};

function create(req, res, next) {
  baseController.create(options)(req, res, next);
}

function readAll(req, res, next) {
  baseController.readAll({
    ...optionsRead,
    isSearchable: true,
  })(req, res, next);
}

function read(req, res, next) {
  baseController.read(optionsRead)(req, res, next);
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
