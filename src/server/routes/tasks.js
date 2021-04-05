import express from 'express';

import { optionalAuthMiddleware } from '~/server/middlewares/passport';
import tasksController from '~/server/controllers/tasks';
import tasksValidation from '~/server/validations/tasks';
import validate from '~/server/services/validate';

const router = express.Router();

router.put(
  '/',
  optionalAuthMiddleware,
  validate(tasksValidation.create),
  tasksController.create,
);

export default router;
