import express from 'express';
import httpStatus from 'http-status';

import APIError from '~/server/helpers/errors';
import authMiddleware from '~/server/middlewares/passport';
import authRouter from '~/server/routes/auth';
import festivalsRouter from '~/server/routes/festivals';
import artworksRouter from '~/server/routes/artworks';
import propertiesRouter from '~/server/routes/properties';
import answersRouter from '~/server/routes/answers';
import usersRouter from '~/server/routes/users';
import voteRouter from '~/server/routes/vote';

import { respondWithSuccess } from '~/server/helpers/respond';

const router = express.Router();

router.get('/', (req, res) => {
  respondWithSuccess(res);
});

router.use('/auth', authRouter);

router.use('/users', authMiddleware, usersRouter);

router.use('/vote', voteRouter);

router.use('/festivals', festivalsRouter);

router.use('/artworks', artworksRouter);

router.use('/properties', propertiesRouter);

router.use('/answers', answersRouter);

router.use(() => {
  throw new APIError(httpStatus.NOT_FOUND);
});

export default router;
