import { respondWithSuccess } from '~/server/helpers/respond';

async function create(req, res, next) {
  try {
    respondWithSuccess(res, {
      receipt: 'received',
    });
  } catch (error) {
    return next(error);
  }
}

export default {
  create,
};
