import express from 'express';

import Question from '~/server/models/question';
import fetchFromGraph from '~/server/middlewares/fetchFromGraph';
import resolveChainIdsMiddleware from '~/server/middlewares/resolveChainIds';
import resourcesMiddleware from '~/server/middlewares/resources';
import validate from '~/server/services/validate';
import validateVoteMiddleware from '~/server/middlewares/validateVote';
import voteController from '~/server/controllers/votes';
import voteValidation from '~/server/validations/votes';
import { answersByQuestion } from '~/common/services/subgraph';

const router = express.Router();

const getQuestionResource = resourcesMiddleware({
  model: Question,
  modelKey: 'address',
  paramsKey: 'questionAddress',
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
  resolveChainIdsMiddleware,
  validateVoteMiddleware,
  voteController.create,
);

export default router;
