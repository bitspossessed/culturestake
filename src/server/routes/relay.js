import express from 'express';

import relayController from '~/server/controllers/relay';
import relayValidation from '~/server/validations/relay';
import validate from '~/server/helpers/validate';

const router = express.Router();

//router.post('/', () => {console.log('middle')}, validate(relayValidation.metatx), () => {console.log('middle2')}, relayController.relay);
router.post('/', validate(relayValidation.metatx), relayController.relay);

export default router;
