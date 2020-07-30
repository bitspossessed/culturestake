import express from 'express';

import Artwork from '~/server/models/artwork';
import artworksController from '~/server/controllers/artworks';
import artworksValidation from '~/server/validations/artworks';
import authMiddleware from '~/server/middlewares/passport';
import isSearchableMiddleware from '~/server/middlewares/isSearchable';
import resourcesMiddleware from '~/server/middlewares/resources';
import validate from '~/server/services/validate';

const router = express.Router();

const getArtworkResource = resourcesMiddleware({
  model: Artwork,
});

router.put(
  '/',
  authMiddleware,
  validate(artworksValidation.create),
  artworksController.create,
);

router.get(
  '/',
  validate(artworksValidation.readAll),
  isSearchableMiddleware,
  artworksController.readAll,
);

router.get(
  '/:slug',
  validate(artworksValidation.read),
  getArtworkResource,
  artworksController.read,
);

router.post(
  '/:slug',
  authMiddleware,
  validate(artworksValidation.update),
  getArtworkResource,
  artworksController.update,
);

router.delete(
  '/:slug',
  authMiddleware,
  validate(artworksValidation.destroy),
  getArtworkResource,
  artworksController.destroy,
);

export default router;
