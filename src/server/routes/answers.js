import express from 'express';

import Answer from '~/server/models/answer';
import authMiddleware from '~/server/middlewares/passport';
import answersController from '~/server/controllers/answers';
import answersValidation from '~/server/validations/answers';
import resourcesMiddleware from '~/server/middlewares/resources';
import validate from '~/server/helpers/validate';

const router = express.Router();

const getAnswerResource = resourcesMiddleware({
  model: Answer,
});

router.put(
  '/',
  authMiddleware,
  (req, res, next) => { console.log(res.status); next() },
  validate(answersValidation.create),
  answersController.create,
);

router.get('/', validate(answersValidation.readAll), answersController.readAll);

router.get(
  '/:slug',
  validate(answersValidation.read),
  getAnswerResource,
  answersController.read,
);

router.delete(
  '/:slug',
  authMiddleware,
  validate(answersValidation.destroy),
  getAnswerResource,
  answersController.destroy,
);

export default router;
