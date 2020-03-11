import express from 'express';

import validate from '~/common/helpers/validate';

import User from '~/server/models/user';
import resourcesMiddleware from '~/server/middlewares/resources';
import usersController from '~/server/controllers/users';
import usersValidation from '~/server/validations/users';

const router = express.Router();

const getUserResource = resourcesMiddleware({
  model: User,
});

router.put('/', validate(usersValidation.create), usersController.create);

router.get('/', validate(usersValidation.readAll), usersController.readAll);

router.get(
  '/:slug',
  validate(usersValidation.read),
  getUserResource,
  usersController.read,
);

router.post(
  '/:slug',
  validate(usersValidation.update),
  getUserResource,
  usersController.update,
);

router.delete(
  '/:slug',
  validate(usersValidation.destroy),
  getUserResource,
  usersController.destroy,
);

export default router;
