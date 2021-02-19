import express from 'express';
import httpStatus from 'http-status';

import APIError from '~/server/helpers/errors';
import answersRouter from '~/server/routes/answers';
import artistsRouter from '~/server/routes/artists';
import artworksRouter from '~/server/routes/artworks';
import authMiddleware from '~/server/middlewares/passport';
import authRouter from '~/server/routes/auth';
import festivalsRouter from '~/server/routes/festivals';
import organisationsRouter from '~/server/routes/organisations';
import propertiesRouter from '~/server/routes/properties';
import questionsRouter from '~/server/routes/questions';
import uploadsRouter from '~/server/routes/uploads';
import usersRouter from '~/server/routes/users';
import votesRouter from '~/server/routes/votes';
import voteweightsRouter from '~/server/routes/voteweights';
import { respondWithSuccess } from '~/server/helpers/respond';

const router = express.Router();

router.get('/', (req, res) => {
  respondWithSuccess(res);
});

router.use('/auth', authRouter);

router.use('/uploads', uploadsRouter);

router.use('/users', authMiddleware, usersRouter);

router.use('/votes', votesRouter);

router.use('/festivals', festivalsRouter);

router.use('/questions', questionsRouter);

router.use('/artworks', artworksRouter);

router.use('/artists', artistsRouter);

router.use('/properties', propertiesRouter);

router.use('/answers', answersRouter);

router.use('/organisations', organisationsRouter);

router.use('/voteweights', voteweightsRouter);

router.use(() => {
  throw new APIError(httpStatus.NOT_FOUND);
});

export default router;
