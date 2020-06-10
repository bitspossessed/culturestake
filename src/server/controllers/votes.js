import Vote from '~/server/models/vote';
import { QuestionHasManyAnswers } from '~/server/database/associations';
import Question from '~/server/models/question';
import baseController from '~/server/controllers';
import {
  filterResponseFieldsAll,
  filterResponseFields,
} from '~/server/controllers';
import dispatch from '~/server/services/dispatcher';
import { respondWithSuccess } from '~/server/helpers/respond';

const topThreeFilter = (req, data, options) => {
  // combine graph data with postgres data, mapping chainId : id
  let combined = combineWithGraph(
    req.locals.graphData,
    data.answers,
    'chainId',
  );
  // if the user is authenticated, pass them to the normal filterResponseFieldsAll
  // since they can see everything
  if (req.locals && req.locals.user) {
    data.set('answers', combined, {
      raw: true,
    });
    return filterResponseFieldsAll(req, data, options);
  }
  // find the top three votePowers
  const topThree = findTopThree(combined, 'votePower');
  // for each answer, if it's in the top three votePowers, override the options and
  // allow the protected fields to be seen
  combined = combined.map((datum) => {
    if (topThree.includes(parseInt(datum['votePower']))) {
      const optionsOverride = {
        ...options,
        fields: options.fields.concat(options.fieldsProtected),
      };
      return filterResponseFields(req, datum, optionsOverride);
    }
    return filterResponseFields(req, datum, options);
  });
  data.set('answers', combined, {
    raw: true,
  });
  return data;
};

const options = {
  model: Question,
  fields: [
    'title',
    'address',
    'answers',
    'votes',
    'voteTokens',
    'votePower',
    'question',
  ],
  fieldsProtected: ['id', 'chainId', 'type', 'artworkId', 'propertyId'],
  include: [QuestionHasManyAnswers],
  associations: [
    {
      association: QuestionHasManyAnswers,
      destroyCascade: true,
    },
  ],
  customFilter: topThreeFilter,
};

const combineWithGraph = (graphData, apiData, matchingKey) => {
  const combined = graphData.map((datum) => {
    const match = apiData.find((d) => d[matchingKey] === datum.id);
    if (match) {
      return Object.assign(match.dataValues, datum);
    }
    return match;
  });
  return combined;
};

const findTopThree = (array, matchingKey) => {
  // returns top three values, regardless of duplicates in array
  // unless there are less than three unique values, then returns all values
  let results = array.map((item) => parseInt(item[matchingKey]));
  results = Array.from(new Set(results));
  return results.sort((itemA, itemB) => itemB - itemA).slice(0, 3);
};

async function create(req, res, next) {
  const vote = req.body;

  try {
    await dispatch({
      ...vote,
      answers: vote.answers.map((a) => a.chainId),
    });
    await Vote.create({
      ...vote,
      answers: vote.answers.map((a) => a.id),
    });
    respondWithSuccess(res);
  } catch (error) {
    return next(error);
  }
}

async function read(req, res, next) {
  try {
    baseController.read(options)(req, res, next);
  } catch (error) {
    return next(error);
  }
}

export default {
  create,
  read,
};
