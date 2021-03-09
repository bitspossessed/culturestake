import express from 'express';

import Question from '~/server/models/question';
import Vote from '~/server/models/vote';
import fetchFromGraph from '~/server/middlewares/fetchFromGraph';
import resolveChainIdsMiddleware from '~/server/middlewares/resolveChainIds';
import resourcesMiddleware from '~/server/middlewares/resources';
import validate from '~/server/services/validate';
import validateVoteMiddleware from '~/server/middlewares/validateVote';
import applyVoteweightsMiddleware from '~/server/middlewares/applyVoteweights';
import locationsMiddleware from '~/server/middlewares/locationFormatting';
import voteController from '~/server/controllers/votes';
import voteValidation from '~/server/validations/votes';
import authMiddleware, {
  optionalAuthMiddleware,
} from '~/server/middlewares/passport';
import { questionQuery } from '~/common/services/subgraph';

const router = express.Router();

const getQuestionResource = resourcesMiddleware({
  model: Question,
});

const getVoteResource = resourcesMiddleware({
  model: Vote,
  modelKey: 'id',
  paramsKey: 'id',
});

const getQuestionGraphData = (req, res, next) => {
  fetchFromGraph(questionQuery, {
    id: req.locals.resource.chainId,
  })(req, res, next);
};

router.post(
  '/',
  optionalAuthMiddleware,
  validate(voteValidation.vote),
  locationsMiddleware,
  resolveChainIdsMiddleware,
  validateVoteMiddleware,
  applyVoteweightsMiddleware,
  voteController.vote,
);

router.get(
  '/:id',
  authMiddleware,
  validate(voteValidation.read),
  getVoteResource,
  voteController.read,
);

router.get(
  '/:slug/results',
  optionalAuthMiddleware,
  validate(voteValidation.results),
  getQuestionResource,
  getQuestionGraphData,
  voteController.results,
);

export default router;
