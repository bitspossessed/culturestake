import express from 'express';

import Question from '~/server/models/question';
import authMiddleware, {
  optionalAuthMiddleware,
} from '~/server/middlewares/passport';
import questionsController from '~/server/controllers/questions';
import questionsValidation from '~/server/validations/questions';
import resourcesMiddleware from '~/server/middlewares/resources';
import validate from '~/server/services/validate';

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
  optionalAuthMiddleware,
  validate(questionsValidation.readAll),
  questionsController.readAll,
);

router.get(
  '/:id',
  optionalAuthMiddleware,
  validate(questionsValidation.read),
  getQuestionResource,
  questionsController.read,
);

router.get(
  '/:id/votes',
  optionalAuthMiddleware,
  validate(questionsValidation.getVotes),
  getQuestionResource,
  questionsController.getVotes,
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
