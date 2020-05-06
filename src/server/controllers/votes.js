import Vote from '~/server/models/vote';
import dispatch from '~/server/services/dispatcher';
import { respondWithSuccess } from '~/server/helpers/respond';

async function create(req, res, next) {
  const vote = req.body;

  try {
    // @TODO: Revert vote creation when dispatch failed
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
