import express from 'express';

import authController from '~/server/controllers/auth';
import authValidation from '~/server/validations/auth';
import validate from '~/server/services/validate';
import { authLocalMiddleware } from '~/server/middlewares/passport';

const router = express.Router();

router.post(
  '/',
  validate(authValidation.requestToken),
  authLocalMiddleware,
  authController.requestToken,
);

export default router;
