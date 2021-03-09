import express from 'express';

import authMiddleware from '~/server/middlewares/passport';
import tasksController from '~/server/controllers/tasks';
import tasksValidation from '~/server/validations/tasks';
import validate from '~/server/services/validate';

const router = express.Router();

router.put(
  '/',
  authMiddleware,
  validate(tasksValidation.create),
  tasksController.create,
);

export default router;
