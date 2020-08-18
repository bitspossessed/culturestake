import Artwork from '~/server/models/artwork';
import baseController from '~/server/controllers';
import {
  ArtworkBelongsToArtist,
  ArtworkBelongsToManyFestivals,
  ArtworkHasManyImages,
  ArtworkHasManyDocuments,
  artistFields,
  artworkFields,
  festivalFields,
  imageFileFields,
  baseFileFields,
} from '~/server/database/associations';

const options = {
  model: Artwork,
  fields: [...artworkFields, 'images'],
  include: [ArtworkHasManyImages, ArtworkHasManyDocuments],
  associations: [
    {
      association: ArtworkHasManyImages,
      destroyCascade: true,
      fields: [...imageFileFields],
    },
    {
      association: ArtworkHasManyDocuments,
      destroyCascade: true,
      fields: [...baseFileFields],
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
    ArtworkHasManyDocuments,
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
      fields: [...artistFields],
    },
    {
      association: ArtworkBelongsToManyFestivals,
      destroyCascade: false,
      fields: [...festivalFields],
    },
    {
      association: ArtworkHasManyDocuments,
      destroyCascade: true,
      fields: [...baseFileFields],
    },
  ],
};

function create(req, res, next) {
  baseController.create(options)(req, res, next);
}

function readAll(req, res, next) {
  baseController.readAll({
    ...optionsRead,
    where: req.locals && req.locals.query,
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
