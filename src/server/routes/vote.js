import express from 'express';

import voteController from '~/server/controllers/votes';
import voteValidation from '~/server/validations/votes';
import validate from '~/server/helpers/validate';

const router = express.Router();

// router.post('/', (req, res, next) => {
//     console.log('middleware')
//     try {
//       validate(voteValidation.create)
//       console.log('validated')
//       next()
//     } catch (err) {
//       console.log('caught error')
//       console.log(err)
//       next()
//     }
//   }, voteController.create);

router.post('/', validate(voteValidation.create), voteController.create);

export default router;
