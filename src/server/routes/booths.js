import express from 'express';

import authMiddleware from '~/server/middlewares/passport';
import boothsController from '~/server/controllers/booths';
import boothsValidation from '~/server/validations/booths';
import validate from '~/server/services/validate';

const router = express.Router();

router.get(
  '/:festivalChainId',
  authMiddleware,
  validate(boothsValidation.getArtworks),
  boothsController.getArtworks,
);

export default router;
