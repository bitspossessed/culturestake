import express from 'express';

import authController from '../controllers/auth';
import authValidation from '../validations/auth';
import validate from '../helpers/validate';
import { authLocalMiddleware } from '../middlewares/passport';

const router = express.Router();

router.post(
  '/',
  validate(authValidation.requestToken),
  authLocalMiddleware,
  authController.requestToken,
);

export default router;
