import express from 'express';

import Voteweight from '~/server/models/voteweight';
import authMiddleware, {
  optionalAuthMiddleware,
} from '~/server/middlewares/passport';
import voteweightsController from '~/server/controllers/voteweights';
import voteweightsValidation from '~/server/validations/voteweights';
import resourcesMiddleware from '~/server/middlewares/resources';
import locationsMiddleware from '~/server/middlewares/locationFormatting';
import validate from '~/server/services/validate';

const router = express.Router();

const getVoteweightResource = resourcesMiddleware({
  model: Voteweight,
  modelKey: 'id',
  paramsKey: 'id',
});

router.put(
  '/',
  authMiddleware,
  validate(voteweightsValidation.create),
  locationsMiddleware,
  voteweightsController.create,
);

router.get(
  '/',
  optionalAuthMiddleware,
  validate(voteweightsValidation.readAll),
  voteweightsController.readAll,
);

router.get(
  '/:id',
  optionalAuthMiddleware,
  validate(voteweightsValidation.read),
  getVoteweightResource,
  voteweightsController.read,
);

router.post(
  '/:id',
  authMiddleware,
  validate(voteweightsValidation.update),
  getVoteweightResource,
  locationsMiddleware,
  voteweightsController.update,
);

router.delete(
  '/:id',
  authMiddleware,
  validate(voteweightsValidation.destroy),
  getVoteweightResource,
  voteweightsController.destroy,
);

export default router;
