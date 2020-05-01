import express from 'express';

import Answer from '~/server/models/answer';
import authMiddleware, {
  optionalAuthMiddleware,
} from '~/server/middlewares/passport';
import answersController from '~/server/controllers/answers';
import answersValidation from '~/server/validations/answers';
import resourcesMiddleware from '~/server/middlewares/resources';
import validate from '~/server/helpers/validate';

const router = express.Router();

const getAnswerResource = resourcesMiddleware({
  model: Answer,
  modelKey: 'id',
  paramsKey: 'id',
});

router.put(
  '/',
  authMiddleware,
  validate(answersValidation.create),
  answersController.create,
);

router.get(
  '/',
  optionalAuthMiddleware,
  validate(answersValidation.readAll),
  answersController.readAll,
);

router.get(
  '/:id',
  optionalAuthMiddleware,
  validate(answersValidation.read),
  getAnswerResource,
  answersController.read,
);

router.delete(
  '/:id',
  authMiddleware,
  validate(answersValidation.destroy),
  getAnswerResource,
  answersController.destroy,
);

export default router;
