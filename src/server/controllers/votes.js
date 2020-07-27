import httpStatus from 'http-status';

import Question from '~/server/models/question';
import Vote from '~/server/models/vote';
import baseController from '~/server/controllers';
import dispatchVote from '~/server/services/dispatcher';
import { QuestionHasManyAnswers } from '~/server/database/associations';
import { filterResponse } from '~/server/helpers/respond';
import { filterResponseFields } from '~/server/controllers';
import { getQuestion } from '~/common/services/contracts';
import { respondWithSuccess } from '~/server/helpers/respond';

const PUBLIC_TOP_ANSWERS = 3;

const answerAssociation = {
  association: QuestionHasManyAnswers,
  fields: ['type', 'votePower', 'voteTokens', 'votes'],
  fieldsProtected: ['artworkId', 'propertyId'],
};

const options = {
  model: Question,
  fields: ['answers', 'chainId', 'title'],
  fieldsProtected: ['artworkId', 'festivalId'],
  include: [QuestionHasManyAnswers],
  associations: [answerAssociation],
  customFilter: topThreeFilter,
};

function combineAnswers(graphData, apiData) {
  return graphData
    .reduce((acc, graphDatum) => {
      const matchedApiDatum = apiData.find(
        (apiDatum) => apiDatum.chainId === graphDatum.id,
      );

      if (matchedApiDatum) {
        ['votePower', 'voteTokens', 'votes'].forEach((fieldName) => {
          matchedApiDatum.set(fieldName, parseInt(graphDatum[fieldName], 10), {
            raw: true,
          });
        });

        acc.push(matchedApiDatum);
      }

      return acc;
    }, [])
    .sort((itemA, itemB) => {
      return itemB.get('votePower') - itemA.get('votePower');
    });
}

function findTopThreeVotePowers(answers) {
  // Returns top three values, regardless of duplicates in array unless there
  // are less than three unique values, then returns all values
  const votePowers = answers.map((answer) => answer.get('votePower'));
  return Array.from(new Set(votePowers))
    .sort((votePowerA, votePowerB) => votePowerB - votePowerA)
    .slice(0, PUBLIC_TOP_ANSWERS);
}

function topThreeFilter(req, data) {
  const { graphData, user } = req.locals;

  // Combine graph data with postgres data, mapping chainId : id
  const answers = combineAnswers(graphData.question.answers, data.answers);

  // Find the top three votePowers
  const topThreeVotePowers = findTopThreeVotePowers(answers);

  // For each answer, if it's in the top three votePowers, override the options
  // and allow the protected fields to be seen
  const answersFiltered = answers.map((answer) => {
    // If the user is authenticated, pass them to the normal
    // filterResponseFieldsAll since they can see everything
    if (topThreeVotePowers.includes(answer.get('votePower')) || user) {
      // Override the options and allow the protected fields to be seen
      return filterResponse(
        answer,
        answerAssociation.fields.concat(answerAssociation.fieldsProtected),
      );
    }

    return filterResponse(answer, answerAssociation.fields);
  });

  data.set('answers', answersFiltered, {
    raw: true,
  });

  return filterResponseFields(req, data, {
    ...options,
    associations: [],
  });
}

// Create a new Vote
async function create(req, res, next) {
  const { vote } = req.locals;

  const { address: festivalQuestionAddress } = await getQuestion(
    vote.festivalQuestionChainId,
  );
  const { address: artworkQuestionAddress } = await getQuestion(
    vote.artworkQuestionChainId,
  );

  try {
    // Vote on the blockchain
    await dispatchVote({
      ...vote,
      answerChainIds: vote.festivalAnswerChainIds,
      questionAddress: festivalQuestionAddress,
      voteTokens: vote.festivalVoteTokens,
    });

    await dispatchVote({
      ...vote,
      answerChainIds: vote.artworkAnswerChainIds,
      questionAddress: artworkQuestionAddress,
      voteTokens: vote.artworkVoteTokens,
    });

    // ... and store it locally on database as well
    await Vote.create(vote);

    respondWithSuccess(res, null, httpStatus.CREATED);
  } catch (error) {
    return next(error);
  }
}

// Read Question with answers
async function read(req, res, next) {
  baseController.read(options)(req, res, next);
}

export default {
  create,
  read,
};
