import express from 'express';

import invitationsController from '~/server/controllers/invitations';
import invitationsValidation from '~/server/validations/invitations';
import validate from '~/server/services/validate';

const router = express.Router();

router.get(
  '/:token',
  validate(invitationsValidation.read),
  invitationsController.read,
);

export default router;
