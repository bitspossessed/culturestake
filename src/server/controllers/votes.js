import { respondWithSuccess } from '~/server/helpers/respond';
import dispatch from '~/server/services/dispatcher';
import Vote from '~/server/models/vote';
import { QuestionHasManyAnswers } from '~/server/database/associations';
import Question from '~/server/models/question';
import baseController from '~/server/controllers';
import {
  filterResponseFieldsAll,
  filterResponseFields,
} from '~/server/controllers';

const customFilter = (req, data, options) => {
  let combined = combineWithGraph(
    req.locals.graphData,
    data.answers,
    'chainId',
  );
  if (req.locals && req.locals.user) {
    data.set('answers', combined, {
      raw: true,
    });
    return filterResponseFieldsAll(req, data, options);
  }
  const topThree = findTopThree(combined, 'votePower');
  combined = combined.map(datum => {
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
  customFilter,
};

const combineWithGraph = (graphData, apiData, matchingKey) => {
  const combined = graphData.map(i => {
    const datum = apiData.find(d => d[matchingKey] === i.id);
    if (datum) return Object.assign(datum.dataValues, i);
    return i;
  });
  return combined;
};

const findTopThree = (array, matchingKey) => {
  let first = -1;
  let second = -1;
  let third = -1;
  let results = array.map(item => parseInt(item[matchingKey]));
  results = new Set(results);
  results.forEach(item => {
    if (item > first) {
      third = second;
      second = first;
      first = item;
    } else if (item > second) {
      third = second;
      second = item;
    } else if (item > third) {
      third = item;
    }
  });
  return [first, second, third];
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
