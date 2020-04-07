import { respondWithSuccess } from '~/server/helpers/respond';
import dispatch from '~/server/services/dispatcher';
import Vote from '~/server/models/vote';

async function create(req, res, next) {
  const vote = req.body;
  try {
    await Vote.create(vote);
    await dispatch(vote);
    respondWithSuccess(res);
  } catch (error) {
    return next(error);
  }
}

export default {
  create,
};
