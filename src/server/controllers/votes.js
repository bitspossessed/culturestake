import Question from '~/server/models/question';
import Vote from '~/server/models/vote';
import baseController from '~/server/controllers';
import dispatchVote from '~/server/services/dispatcher';
import { QuestionHasManyAnswers } from '~/server/database/associations';
import {
  filterResponseFieldsAll,
  filterResponseFields,
} from '~/server/controllers';
import { respondWithSuccess } from '~/server/helpers/respond';

const topThreeFilter = (req, data, options) => {
  // Combine graph data with postgres data, mapping chainId : id
  let combined = combineWithGraph(
    req.locals.graphData.answers,
    data.answers,
    'chainId',
  );

  // If the user is authenticated, pass them to the normal filterResponseFieldsAll
  // since they can see everything
  if (req.locals && req.locals.user) {
    data.set('answers', combined, {
      raw: true,
    });

    return filterResponseFieldsAll(req, data, options);
  }

  // Find the top three votePowers
  const topThree = findTopThree(combined, 'votePower');

  // For each answer, if it's in the top three votePowers, override the options and
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
    'address',
    'answers',
    'question',
    'title',
    'votePower',
    'voteTokens',
    'votes',
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
  // Returns top three values, regardless of duplicates in array unless there
  // are less than three unique values, then returns all values
  return array
    .map((item) => parseInt(item[matchingKey], 10))
    .sort((itemA, itemB) => itemB - itemA)
    .slice(0, 3);
};

async function create(req, res, next) {
  const { vote } = req.locals;

  try {
    // Vote on the blockchain
    await dispatchVote({
      ...vote,
      answerChainIds: vote.festivalAnswerChainIds,
      questionAddress: vote.festivalQuestionAddress,
      voteTokens: vote.festivalVoteTokens,
    });

    await dispatchVote({
      ...vote,
      answerChainIds: vote.artworkAnswerChainIds,
      questionAddress: vote.artworkQuestionAddress,
      voteTokens: vote.artworkVoteTokens,
    });

    // ... and store it locally on database as well
    await Vote.create(vote);

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
