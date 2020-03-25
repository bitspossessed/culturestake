import express from 'express';

import voteController from '~/server/controllers/votes';
import voteValidation from '~/server/validations/votes';
import validate from '~/server/helpers/validate';
import validateVote from '~/server/middlewares/validateVote';

const router = express.Router();

router.post(
  '/',
  validate(voteValidation.create),
  validateVote,
  voteController.create,
);

export default router;
