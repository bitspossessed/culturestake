import express from 'express';

import Organisation from '~/server/models/organisation';
import organisationsController from '~/server/controllers/organisations';
import organisationsValidation from '~/server/validations/organisations';
import authMiddleware, {
  optionalAuthMiddleware,
} from '~/server/middlewares/passport';
import isSearchableMiddleware from '~/server/middlewares/isSearchable';
import resourcesMiddleware from '~/server/middlewares/resources';
import validate from '~/server/services/validate';

const router = express.Router();

const getOrganisationResource = resourcesMiddleware({
  model: Organisation,
});

router.put(
  '/',
  authMiddleware,
  validate(organisationsValidation.create),
  organisationsController.create,
);

router.get(
  '/',
  optionalAuthMiddleware,
  validate(organisationsValidation.readAll),
  isSearchableMiddleware,
  organisationsController.readAll,
);

router.get(
  '/:slug',
  optionalAuthMiddleware,
  validate(organisationsValidation.read),
  getOrganisationResource,
  organisationsController.read,
);

router.post(
  '/:slug',
  authMiddleware,
  validate(organisationsValidation.update),
  getOrganisationResource,
  organisationsController.update,
);

router.delete(
  '/:slug',
  authMiddleware,
  validate(organisationsValidation.destroy),
  getOrganisationResource,
  organisationsController.destroy,
);

export default router;
