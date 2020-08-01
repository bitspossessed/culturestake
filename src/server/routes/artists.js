import express from 'express';

import Artist from '~/server/models/artist';
import artistsController from '~/server/controllers/artists';
import artistsValidation from '~/server/validations/artists';
import authMiddleware, {
  optionalAuthMiddleware,
} from '~/server/middlewares/passport';
import isSearchableMiddleware from '~/server/middlewares/isSearchable';
import resourcesMiddleware from '~/server/middlewares/resources';
import validate from '~/server/services/validate';

const router = express.Router();

const getArtistResource = resourcesMiddleware({
  model: Artist,
});

router.put(
  '/',
  authMiddleware,
  validate(artistsValidation.create),
  artistsController.create,
);

router.get(
  '/',
  optionalAuthMiddleware,
  validate(artistsValidation.readAll),
  isSearchableMiddleware,
  artistsController.readAll,
);

router.get(
  '/:slug',
  optionalAuthMiddleware,
  validate(artistsValidation.read),
  getArtistResource,
  artistsController.read,
);

router.post(
  '/:slug',
  authMiddleware,
  validate(artistsValidation.update),
  getArtistResource,
  artistsController.update,
);

router.delete(
  '/:slug',
  authMiddleware,
  validate(artistsValidation.destroy),
  getArtistResource,
  artistsController.destroy,
);

export default router;
