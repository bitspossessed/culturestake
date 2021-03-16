import express from 'express';

import authMiddleware from '~/server/middlewares/passport';
import boothsController from '~/server/controllers/booths';

const router = express.Router();

router.put('/', authMiddleware, boothsController.create);

export default router;
