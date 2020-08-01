import express from 'express';

import Property from '~/server/models/property';
import authMiddleware, {
  optionalAuthMiddleware,
} from '~/server/middlewares/passport';
import propertiesController from '~/server/controllers/properties';
import propertiesValidation from '~/server/validations/properties';
import resourcesMiddleware from '~/server/middlewares/resources';
import isSearchableMiddleware from '~/server/middlewares/isSearchable';
import validate from '~/server/services/validate';

const router = express.Router();

const getPropertyResource = resourcesMiddleware({
  model: Property,
});

router.put(
  '/',
  authMiddleware,
  validate(propertiesValidation.create),
  propertiesController.create,
);

router.get(
  '/',
  optionalAuthMiddleware,
  validate(propertiesValidation.readAll),
  isSearchableMiddleware,
  propertiesController.readAll,
);

router.get(
  '/:slug',
  optionalAuthMiddleware,
  validate(propertiesValidation.read),
  getPropertyResource,
  propertiesController.read,
);

router.post(
  '/:slug',
  authMiddleware,
  validate(propertiesValidation.update),
  getPropertyResource,
  propertiesController.update,
);

router.delete(
  '/:slug',
  authMiddleware,
  validate(propertiesValidation.destroy),
  getPropertyResource,
  propertiesController.destroy,
);

export default router;
