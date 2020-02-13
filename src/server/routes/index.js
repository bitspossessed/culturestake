import express from 'express';
import httpStatus from 'http-status';

import APIError from '../helpers/errors';
import authMiddleware from '../middlewares/passport';
import authRouter from './auth';
import usersRouter from './users';
import { respondWithSuccess } from '../helpers/respond';

const router = express.Router();

router.get('/', (req, res) => {
  respondWithSuccess(res);
});

router.use('/auth', authRouter);

router.use('/users', authMiddleware, usersRouter);

router.use(() => {
  throw new APIError(httpStatus.NOT_FOUND);
});

export default router;
