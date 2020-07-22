import express from 'express';

import Question from '~/server/models/question';
import authMiddleware from '~/server/middlewares/passport';
import questionsController from '~/server/controllers/questions';
import questionsValidation from '~/server/validations/questions';
import resourcesMiddleware from '~/server/middlewares/resources';
import validate from '~/server/services/validate';

const router = express.Router();

const getQuestionResource = resourcesMiddleware({
  model: Question,
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
  '/:slug',
  validate(questionsValidation.read),
  getQuestionResource,
  questionsController.read,
);

router.post(
  '/:slug',
  authMiddleware,
  validate(questionsValidation.update),
  getQuestionResource,
  questionsController.update,
);

router.delete(
  '/:slug',
  authMiddleware,
  validate(questionsValidation.destroy),
  getQuestionResource,
  questionsController.destroy,
);

export default router;
