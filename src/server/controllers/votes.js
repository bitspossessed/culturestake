import { respondWithSuccess } from '~/server/helpers/respond';
import dispatch from '~/server/services/dispatcher';
import requestGraph from '~/common/services/subgraph';
import Vote from '~/server/models/vote';
import Answer from '~/server/models/answer';
import baseController from '~/server/controllers';

const filterAnswers = graphAnswers => {
  return graphAnswers;
};

const options = {
  model: Answer,
  fields: ['type', 'artworkId', 'propertyId', 'votes', 'voteTokens', 'votePower'],
  // fieldsProtected: ['chainId'],
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
      {question: "${req.params.question}"}
    ) { id voteTokens votePower votes active question { id } }
  }`;
  try {
    req.locals.graphData = await requestGraph(query);
    baseController.readAll(options)(req, res, next);
  } catch (error) {
    return next(error);
  }
}

export default {
  create,
  read,
};
