import express from 'express';

import voteController from '~/server/controllers/votes';
import voteValidation from '~/server/validations/votes';
import validate from '~/server/helpers/validate';

const router = express.Router();

router.post('/', validate(voteValidation.metatx), voteController.create);

export default router;
