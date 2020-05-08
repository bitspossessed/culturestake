import { respondWithSuccess } from '~/server/helpers/respond';
import dispatch from '~/server/services/dispatcher';
import requestGraph from '~/common/services/subgraph';
import Vote from '~/server/models/vote';
import Answer from '~/server/models/answer';
import baseController from '~/server/controllers';

const options = {
  model: Answer,
  fields: ['id', 'votes', 'voteTokens', 'votePower', 'question'],
  thresholdFields: ['type', 'artworkId', 'propertyId'],
  threshold: 3,
  thresholdKey: 'votePower',
  graphMatchingKey: 'chainId',
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
    answers
    (where:
      {question: "${req.params.question.toLowerCase()}"}
    ) { id voteTokens votePower votes active question { id } }
  }`;
  try {
    req.locals = req.locals || {};
    const graphData = await requestGraph(query);
    req.locals.graphData = graphData.answers;
    baseController.readAll(options)(req, res, next);
  } catch (error) {
    return next(error);
  }
}

export default {
  create,
  read,
};
