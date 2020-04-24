import express from 'express';

import validate from '~/common/helpers/validate';

import Question from '~/server/models/question';
import authMiddleware from '~/server/middlewares/passport';
import questionsController from '~/server/controllers/questions';
import questionsValidation from '~/server/validations/questions';
import resourcesMiddleware from '~/server/middlewares/resources';

const router = express.Router();

const getQuestionResource = resourcesMiddleware({
  model: Question,
  modelKey: 'id',
  paramsKey: 'id',
});

router.put(
  '/',
  authMiddleware,
  validate(questionsValidation.create),
  questionsController.create,
);

router.get(
  '/',
  validate(questionsValidation.readAll),
  questionsController.readAll,
);

router.get(
  '/:id',
  validate(questionsValidation.read),
  getQuestionResource,
  questionsController.read,
);

router.post(
  '/:id',
  authMiddleware,
  validate(questionsValidation.update),
  getQuestionResource,
  questionsController.update,
);

router.delete(
  '/:id',
  authMiddleware,
  validate(questionsValidation.destroy),
  getQuestionResource,
  questionsController.destroy,
);

export default router;