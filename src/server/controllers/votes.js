import httpStatus from 'http-status';

import Question from '~/server/models/question';
import Vote from '~/server/models/vote';
import baseController from '~/server/controllers';
import dispatchVote from '~/server/services/dispatcher';
import {
  AnswerBelongsToArtwork,
  AnswerBelongsToProperty,
  ArtworkBelongsToArtist,
  QuestionHasManyAnswers,
  VoteHasManyVoteWeights,
  artistFields,
  artworkFields,
  propertyFields,
  questionFields,
  voteFields,
  voteweightFields,
} from '~/server/database/associations';
import { filterResponse } from '~/server/helpers/respond';
import { filterResponseFields } from '~/server/controllers';
import { getQuestion } from '~/common/services/contracts';
import { respondWithSuccess } from '~/server/helpers/respond';
import { quadratify } from '~/common/utils/math';

const PUBLIC_TOP_ANSWERS = 3;

const answerAssociation = {
  fields: ['propertyId', 'votePower', 'voteTokens', 'votes', 'questionId'],
  fieldsProtected: ['artworkId', 'artwork', 'propertyId', 'property'],
  association: QuestionHasManyAnswers,
  associations: [
    {
      association: AnswerBelongsToArtwork,
      fields: [...artworkFields, 'artist'],
      associations: [
        {
          association: ArtworkBelongsToArtist,
          fields: [...artistFields],
        },
      ],
    },
    {
      association: AnswerBelongsToProperty,
      fields: [...propertyFields],
    },
  ],
};

const options = {
  model: Vote,
  fields: [...voteFields, 'voteweights'],
  associations: [
    {
      fields: [...voteweightFields],
      association: VoteHasManyVoteWeights,
    },
  ],
  include: [VoteHasManyVoteWeights],
};

const optionsResults = {
  model: Question,
  fields: [...questionFields, 'answers'],
  associations: [
    {
      ...answerAssociation,
    },
  ],
  include: [
    {
      association: QuestionHasManyAnswers,
      include: [
        {
          association: AnswerBelongsToArtwork,
          include: ArtworkBelongsToArtist,
        },
        AnswerBelongsToProperty,
      ],
    },
  ],
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
  const answers = combineAnswers(
    graphData.question ? graphData.question.answers : [],
    data.answers,
  );

  // Find the top three votePowers
  const topThreeVotePowers = findTopThreeVotePowers(answers);

  // For each answer, if it's in the top three votePowers, override the options
  // and allow the protected fields to be seen
  const answersFiltered = answers.map((answer) => {
    // If the user is authenticated, pass them to the normal
    // filterResponseFieldsAll since they can see everything
    if (topThreeVotePowers.includes(answer.get('votePower')) || user) {
      // Override the options and allow the protected fields to be seen
      return filterResponseFields(req, answer, {
        ...answerAssociation,
        fields: answerAssociation.fields.concat(
          answerAssociation.fieldsProtected,
        ),
      });
    }

    return filterResponse(answer, answerAssociation.fields);
  });

  data.set('answers', answersFiltered, {
    raw: true,
  });

  return filterResponseFields(req, data, {
    ...optionsResults,
    associations: [],
  });
}

// Create a new Vote on the blockchain and in the database
async function vote(req, res, next) {
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
      votePowers: vote.festivalVoteTokens.map((tokens) => quadratify(tokens)),
    });

    await dispatchVote({
      ...vote,
      answerChainIds: vote.artworkAnswerChainIds,
      questionAddress: artworkQuestionAddress,
      voteTokens: vote.artworkVoteTokens,
      votePowers: vote.artworkVoteTokens.map((tokens) => quadratify(tokens)),
    });

    // ... and store it locally on database as well
    await Vote.create(vote);

    respondWithSuccess(res, null, httpStatus.CREATED);
  } catch (error) {
    return next(error);
  }
}

// Read vote results (Question with anonymized answers)
async function results(req, res, next) {
  baseController.read(optionsResults)(req, res, next);
}

function read(req, res, next) {
  baseController.read(options)(req, res, next);
}

export default {
  vote,
  results,
  read,
};
