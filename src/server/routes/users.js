import express from 'express';

import User from '../models/user';
import resourcesMiddleware from '../middlewares/resources';
import usersController from '../controllers/users';
import usersValidation from '../validations/users';
import validate from '../helpers/validate';

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
