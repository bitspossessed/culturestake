import express from 'express';

import { voteByQuestion } from '~/common/services/subgraph';
import voteController from '~/server/controllers/votes';
import voteValidation from '~/server/validations/votes';
import validate from '~/server/helpers/validate';
import swapVoteIds from '~/server/middlewares/swapVoteIds';
import validateVote from '~/server/middlewares/validateVote';
import fetchFromGraph from '~/server/middlewares/fetchFromGraph';

const router = express.Router();

router.get(
  '/:graphParam',
  validate(voteValidation.read),
  fetchFromGraph(voteByQuestion, 'question'),
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
