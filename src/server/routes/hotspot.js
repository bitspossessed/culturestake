import express from 'express';

import hotspotController from '~/server/controllers/hotspot';
import hotspotValidation from '~/server/validations/hotspot';
import validate from '~/server/services/validate';

const router = express.Router();

router.get('/', validate(hotspotValidation.read), hotspotController.read);

export default router;
