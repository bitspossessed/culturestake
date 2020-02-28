import express from 'express';
import httpStatus from 'http-status';

import APIError from '~/server/helpers/errors';
import authMiddleware from '~/server/middlewares/passport';
import authRouter from '~/server/routes/auth';
import usersRouter from '~/server/routes/users';
import relayRouter from '~/server/routes/relay';

import { respondWithSuccess } from '~/server/helpers/respond';

const router = express.Router();

router.get('/', (req, res) => {
  respondWithSuccess(res);
});

router.use('/auth', authRouter);

router.use('/users', authMiddleware, usersRouter);

router.use('/relay', relayRouter);

router.use(() => {
  throw new APIError(httpStatus.NOT_FOUND);
});

export default router;
