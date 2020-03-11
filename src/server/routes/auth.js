import express from 'express';

import validate from '~/common/helpers/validate';

import authController from '~/server/controllers/auth';
import authValidation from '~/server/validations/auth';
import { authLocalMiddleware } from '~/server/middlewares/passport';

const router = express.Router();

router.post(
  '/',
  validate(authValidation.requestToken),
  authLocalMiddleware,
  authController.requestToken,
);

export default router;
