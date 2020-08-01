import httpStatus from 'http-status';

import APIError from '~/server/helpers/errors';
import Answer from '~/server/models/answer';
import Question from '~/server/models/question';
import Vote from '~/server/models/vote';
import logger from '~/server/helpers/logger';
import {
  adminContract,
  getQuestion,
  getQuestionContract,
  getVotingBooth,
} from '~/common/services/contracts';
import { isSignatureValid } from '~/server/services/crypto';
import { packVote, packBooth } from '~/common/services/encoding';

async function checkBooth({
  vote,
  festivalQuestionContractData,
  artworkQuestionContractData,
}) {
  const {
    isInitialized,
    isDeactivated,
    festivalChainId,
  } = await getVotingBooth(vote.boothAddress);

  // Check if ..
  // 1. Voting booth is active
  // 2. Voting booth is actually connected to this festival
  if (
    !isInitialized ||
    isDeactivated ||
    festivalChainId !== festivalQuestionContractData.festivalChainId ||
    festivalChainId !== artworkQuestionContractData.festivalChainId
  ) {
    throw Error('Invalid booth address');
  }
}

async function checkHasVoted({
  vote,
  festivalQuestionContract,
  artworkQuestionContract,
}) {
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

async function checkLocalHasVoted({ vote }) {
  const {
    senderAddress,
    festivalQuestionChainId,
    artworkQuestionChainId,
  } = vote;

  const hasVotedFestivalLocal = await Vote.findOne({
    where: {
      senderAddress,
      festivalQuestionChainId,
    },
  });

  const hasVotedArtworkLocal = await Vote.findOne({
    where: {
      senderAddress,
      artworkQuestionChainId,
    },
  });

  if (hasVotedFestivalLocal || hasVotedArtworkLocal) {
    throw Error('Duplicate vote in database');
  }
}

async function checkArtworkQuestionIsHighestVoted({ vote }) {
  // Question does not exist or is not for artworks
  const question = await Question.findOne({
    where: {
      chainId: vote.artworkQuestionChainId,
    },
  });

  if (!question || !question.artworkId) {
    throw Error('Question is not for artwork answers');
  }

  // We can only vote on properties of an artwork with the highest score of the
  // previous vote.
  //
  // Group answers by given tokens and sort the group with the highest to first
  // position (its possible that multiple answers have the same high amount of
  // tokens).
  const groupAnswers = vote.festivalVoteTokens.reduce((acc, tokens, index) => {
    if (!(tokens in acc)) {
      acc[tokens] = [];
    }

    acc[tokens].push({
      tokens,
      index,
    });

    return acc;
  }, {});

  const highestTokenValue = Math.max(
    ...Object.keys(groupAnswers).map((tokens) => parseInt(tokens, 10)),
  );

  const highestAnswersIds = groupAnswers[highestTokenValue].map(({ index }) => {
    return vote.festivalAnswerIds[index];
  });

  const highestAnswers = await Answer.findAll({
    where: {
      id: highestAnswersIds,
    },
  });

  const isInFestivalAnswer = !!highestAnswers.find((answer) => {
    return question.artworkId === answer.artworkId;
  });

  if (!isInFestivalAnswer) {
    throw Error('Artwork is not the strongest festival answer');
  }
}

async function checkQuestions({
  festivalQuestionContractData,
  artworkQuestionContractData,
}) {
  if (
    !festivalQuestionContractData.isInitialized ||
    festivalQuestionContractData.isDeactivated ||
    !artworkQuestionContractData.isInitialized ||
    artworkQuestionContractData.isDeactivated
  ) {
    throw Error('Inactive question');
  }
}

async function checkNonce({ vote }) {
  const isValidNonce = await adminContract.methods
    .isValidVotingNonce(vote.boothAddress, vote.nonce)
    .call();

  if (!isValidNonce) {
    throw Error('Invalid nonce');
  }
}

async function checkSignatures({ vote }) {
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

async function checkAnswers({
  vote,
  festivalQuestionContract,
  artworkQuestionContract,
}) {
  const checkMaxVotes = async (
    answerIds,
    answerChainIds,
    voteTokens,
    questionContract,
  ) => {
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

    // Max vote tokens is per answer, users get a flexible amount of vote
    // tokens based on how many artworks they saw
    if (sum > maxVoteTokens * answerIds.length) {
      throw Error('Too many votes');
    }
  };

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

  const festivalQuestionContractData = await getQuestion(
    vote.festivalQuestionChainId,
  );
  const artworkQuestionContractData = await getQuestion(
    vote.artworkQuestionChainId,
  );

  const festivalQuestionContract = getQuestionContract(
    festivalQuestionContractData.address,
  );
  const artworkQuestionContract = getQuestionContract(
    artworkQuestionContractData.address,
  );

  const validationArguments = {
    artworkQuestionContract,
    artworkQuestionContractData,
    festivalQuestionContract,
    festivalQuestionContractData,
    vote,
  };

  try {
    for (const validationMethod of [
      checkSignatures,
      checkBooth,
      checkBooth,
      checkNonce,
      checkHasVoted,
      checkLocalHasVoted,
      checkQuestions,
      checkAnswers,
      checkArtworkQuestionIsHighestVoted,
    ]) {
      await validationMethod(validationArguments);
    }

    next();
  } catch (error) {
    logger.verbose(error);

    if (process.env.NODE_ENV === 'production') {
      next(new APIError(httpStatus.UNPROCESSABLE_ENTITY));
    } else {
      next(new APIError(httpStatus.UNPROCESSABLE_ENTITY, error.message));
    }
  }
}
