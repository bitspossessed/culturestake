import express from 'express';

import { answersByQuestion } from '~/common/services/subgraph';
import voteController from '~/server/controllers/votes';
import voteValidation from '~/server/validations/votes';
import validate from '~/server/helpers/validate';
import swapVoteIds from '~/server/middlewares/swapVoteIds';
import validateVote from '~/server/middlewares/validateVote';
import fetchFromGraph from '~/server/middlewares/fetchFromGraph';
import Question from '~/server/models/question';
import resourcesMiddleware from '~/server/middlewares/resources';

const router = express.Router();

const getQuestionResource = resourcesMiddleware({
  model: Question,
  modelKey: 'address',
  paramsKey: 'question',
});

router.get(
  '/:questionAddress',
  validate(voteValidation.read),
  getQuestionResource,
  fetchFromGraph(answersByQuestion, 'questionAddress'),
  voteController.read,
);

router.post(
  '/',
  validate(voteValidation.create),
  swapVoteIds,
  validateVote,
  voteController.create,
);

export default router;
