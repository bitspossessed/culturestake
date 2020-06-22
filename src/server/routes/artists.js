import express from 'express';

import Artist from '~/server/models/artist';
import authMiddleware from '~/server/middlewares/passport';
import artistsController from '~/server/controllers/artists';
import artistsValidation from '~/server/validations/artists';
import resourcesMiddleware from '~/server/middlewares/resources';
import validate from '~/server/helpers/validate';

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
  validate(artistsValidation.readAll),
  artistsController.readAll,
);

router.get(
  '/:slug',
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
  validate(artworksValidation.destroy),
  getArtistResource,
  artistsController.destroy,
);

export default router;
