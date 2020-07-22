import express from 'express';

import Question from '~/server/models/question';
import fetchFromGraph from '~/server/middlewares/fetchFromGraph';
import resolveChainIdsMiddleware from '~/server/middlewares/resolveChainIds';
import resourcesMiddleware from '~/server/middlewares/resources';
import validate from '~/server/services/validate';
import validateVoteMiddleware from '~/server/middlewares/validateVote';
import voteController from '~/server/controllers/votes';
import voteValidation from '~/server/validations/votes';
import { optionalAuthMiddleware } from '~/server/middlewares/passport';
import { questionQuery } from '~/common/services/subgraph';

const router = express.Router();

const getQuestionResource = resourcesMiddleware({
  model: Question,
});

const getQuestionGraphData = (req, res, next) => {
  fetchFromGraph(questionQuery, {
    id: req.locals.resource.chainId,
  })(req, res, next);
};

router.get(
  '/:slug',
  optionalAuthMiddleware,
  validate(voteValidation.read),
  getQuestionResource,
  getQuestionGraphData,
  voteController.read,
);

router.post(
  '/',
  optionalAuthMiddleware,
  validate(voteValidation.create),
  resolveChainIdsMiddleware,
  validateVoteMiddleware,
  voteController.create,
);

export default router;
