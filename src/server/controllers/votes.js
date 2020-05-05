import { respondWithSuccess } from '~/server/helpers/respond';
import dispatch from '~/server/services/dispatcher';
import requestGraph from '~/common/services/subgraph';
import Vote from '~/server/models/vote';

const filterAnswers = graphAnswers => {
  return graphAnswers;
};

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

async function read(req, res, next) {
  const query = `{
    answers()
  }`;
  try {
    const graphAnswers = await requestGraph(query);
    respondWithSuccess(res, filterAnswers(graphAnswers));
  } catch (error) {
    return next(error);
  }
}

export default {
  create,
  read,
};
