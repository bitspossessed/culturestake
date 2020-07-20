import httpStatus from 'http-status';

import APIError from '~/server/helpers/errors';
import Answer from '~/server/models/answer';
import Question from '~/server/models/question';
import Vote from '~/server/models/vote';
import logger from '~/server/helpers/logger';
import {
  getQuestionContract,
  getAdminContract,
} from '~/common/services/contracts';
import { isSignatureValid } from '~/server/services/crypto';
import { packVote, packBooth } from '~/common/services/encoding';

const adminContract = getAdminContract(process.env.ADMIN_CONTRACT);

async function checkBooth(vote, questionContract) {
  const result = await adminContract.methods
    .getVotingBooth(vote.boothAddress)
    .call();
  const isInitialized = result[0];
  const isDeactivated = result[1];
  const festivalId = result[2];

  const festivalChainId = await questionContract.methods.festival().call();

  // Check if ..
  // 1. Voting booth is active
  // 2. Voting booth is actually connected to this festival
  if (!isInitialized || isDeactivated || festivalChainId !== festivalId) {
    throw Error('Invalid booth address');
  }
}

async function checkHasVoted(
  vote,
  festivalQuestionContract,
  artworkQuestionContract,
) {
  const hasVotedFestival = await festivalQuestionContract.methods
    .hasVoted(vote.senderAddress)
    .call();

  const hasVotedArtwork = await artworkQuestionContract.methods
    .hasVoted(vote.senderAddress)
    .call();

  if (hasVotedFestival || hasVotedArtwork) {
    throw Error('Sender voted already');
  }
}

async function checkLocalHasVoted({
  senderAddress,
  festivalQuestionAddress,
  artworkQuestionAddress,
}) {
  const localHasVotedFestival = await Vote.findOne({
    where: {
      senderAddress,
      festivalQuestionAddress,
    },
  });

  const localHasVotedArtwork = await Vote.findOne({
    where: {
      senderAddress,
      artworkQuestionAddress,
    },
  });

  if (localHasVotedFestival || localHasVotedArtwork) {
    throw Error('Duplicate vote in database');
  }
}

async function checkArtworkQuestionIsHighestVoted(vote) {
  // Question does not exist or is not for artworks
  const question = await Question.findOne({
    where: {
      address: vote.artworkQuestionAddress,
    },
  });

  if (!question || !question.artworkId) {
    throw Error('Question is not for artwork answers');
  }

  // We can only vote on properties of an artwork with the highest score of the
  // previous vote
  const highestAnswer = vote.festivalVoteTokens
    .map((tokens, index) => {
      return {
        tokens,
        index,
      };
    })
    .sort((itemA, itemB) => itemB.tokens - itemA.tokens)[0];

  const highestAnswerId = vote.festivalAnswerIds[highestAnswer.index];

  const answer = await Answer.findOne({
    where: {
      id: highestAnswerId,
    },
  });

  if (question.artworkId !== answer.artworkId) {
    throw Error('Artwork is not the strongest festival answer');
  }
}

async function checkQuestions(vote) {
  const activeFestivalQuestion = await adminContract.methods
    .questions(vote.festivalQuestionAddress)
    .call();

  const activeArtworkQuestion = await adminContract.methods
    .questions(vote.artworkQuestionAddress)
    .call();

  if (!activeFestivalQuestion || !activeArtworkQuestion) {
    throw Error('Inactive question');
  }
}

async function checkNonce(vote) {
  const isValidNonce = await adminContract.methods
    .isValidVotingNonce(vote.boothAddress, vote.nonce)
    .call();

  if (!isValidNonce) {
    throw Error('Invalid nonce');
  }
}

async function checkSignatures(vote) {
  if (
    !isSignatureValid(
      packVote(
        vote.festivalAnswerIds,
        vote.festivalVoteTokens,
        vote.artworkAnswerIds,
        vote.artworkVoteTokens,
      ),
      vote.senderSignature,
      vote.senderAddress,
    )
  ) {
    throw Error('Invalid sender signature');
  }

  if (
    !isSignatureValid(
      packBooth(vote.festivalAnswerIds, vote.nonce),
      vote.boothSignature,
      vote.boothAddress,
    )
  ) {
    throw Error('Invalid booth signature');
  }
}

async function checkMaxVotes(
  answerIds,
  answerChainIds,
  voteTokens,
  questionContract,
) {
  const maxVoteTokens = await questionContract.methods.maxVoteTokens().call();
  const seen = {};
  let sum = 0;

  await Promise.all(
    answerIds.map(async (answerId, index) => {
      if (answerId in seen) {
        throw Error('Duplicate answer');
      }

      seen[answerId] = true;
      sum += voteTokens[index];

      const result = await questionContract.methods
        .getAnswer(answerChainIds[index])
        .call();
      const isInitialized = result[0];

      if (!isInitialized) {
        throw Error('Invalid answer');
      }
    }),
  );

  if (sum > maxVoteTokens) {
    throw Error('Too many votes');
  }
}

async function checkAnswers(
  vote,
  festivalQuestionContract,
  artworkQuestionContract,
) {
  if (vote.festivalAnswerIds.length !== vote.festivalVoteTokens.length) {
    throw Error('Wrong festival answer length');
  }

  if (vote.artworkAnswerIds.length !== vote.artworkVoteTokens.length) {
    throw Error('Wrong artwork answer length');
  }

  await checkMaxVotes(
    vote.festivalAnswerIds,
    vote.festivalAnswerChainIds,
    vote.festivalVoteTokens,
    festivalQuestionContract,
  );

  await checkMaxVotes(
    vote.artworkAnswerIds,
    vote.artworkAnswerChainIds,
    vote.artworkVoteTokens,
    artworkQuestionContract,
  );
}

export default async function validateVoteMiddleware(req, res, next) {
  const { vote } = req.locals;

  const festivalContract = getQuestionContract(vote.festivalQuestionAddress);
  const artworkContract = getQuestionContract(vote.artworkQuestionAddress);

  try {
    await checkSignatures(vote);
    await checkBooth(vote, festivalContract);
    await checkBooth(vote, artworkContract);
    await checkNonce(vote);
    await checkHasVoted(vote, festivalContract, artworkContract);
    await checkLocalHasVoted(vote);
    await checkQuestions(vote);
    await checkArtworkQuestionIsHighestVoted(vote);
    await checkAnswers(vote, festivalContract, artworkContract);

    next();
  } catch (error) {
    logger.verbose(error);
    next(new APIError(httpStatus.UNPROCESSABLE_ENTITY, error.message));
  }
}
