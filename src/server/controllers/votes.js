import { respondWithSuccess } from '~/server/helpers/respond';
import dispatch from '~/server/services/dispatcher';

async function create(req, res, next) {
  const vote = req.body;
  try {
    const tx = await dispatch(vote);
    respondWithSuccess(res, {
      receipt: tx,
    });
  } catch (error) {
    return next(error);
  }
}

export default {
  create,
};
