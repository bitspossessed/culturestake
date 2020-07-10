import httpStatus from 'http-status';

import { isSignatureValid } from '~/server/services/crypto';
import { packVote, packBooth } from '~/common/services/encoding';
import {
  getQuestionContract,
  getAdminContract,
} from '~/common/services/contracts';
import { isActiveFestival } from '~/common/services/contracts/festivals';
import Vote from '~/server/models/vote';
import Question from '~/server/models/question';
import APIError from '~/server/helpers/errors';

const admin = getAdminContract(process.env.ADMIN_CONTRACT);

const checkBooth = async (vote, question) => {
  const booth = await admin.methods.getVotingBooth(vote.booth).call();
  const festival = await question.methods.festival().call();
  vote.festival = festival;
  if (!booth[0] || festival !== booth[2]) {
    throw Error('invalid booth');
  }
};

const checkChainHasVoted = async (vote, festivalQuestion, artworkQuestion) => {
  const hasVotedFestival = await festivalQuestion.methods
    .hasVoted(vote.sender)
    .call();
  const hasVotedArtwork = await artworkQuestion.methods
    .hasVoted(vote.sender)
    .call();
  if (hasVotedFestival || hasVotedArtwork) {
    throw Error('has voted');
  }
};

const checkLocalHasVoted = async (vote) => {
  const localHasVotedFestival = await Vote.findOne({
    where: { sender: vote.sender, festivalQuestion: vote.festivalQuestion },
  });
  const localHasVotedArtwork = await Vote.findOne({
    where: { sender: vote.sender, artworkQuestion: vote.artworkQuestion },
  });
  if (localHasVotedFestival || localHasVotedArtwork) {
    throw Error('has voted');
  }
};

const checkArtworkQuestionIsHighestVoted = async (vote) => {
  let highestVote = Array.from(new Set(vote.festivalVoteTokens));
  highestVote = highestVote.sort((itemA, itemB) => itemB - itemA)[0];
  const question = await Question.findOne({
    where: { address: vote.artworkQuestion },
  });
  if (!question || !question.artworkId) {
    throw Error('invalid artwork-question');
  }
  const justAnswerIds = vote.festivalAnswers.map((a) => a.id);
  const indexOfArtwork = justAnswerIds.indexOf(question.artworkId);
  if (vote.festivalVoteTokens[indexOfArtwork] !== highestVote) {
    throw Error('invalid artwork-question');
  }
};

const checkQuestions = async (vote) => {
  const activeFestivalQuestion = await admin.methods
    .questions(vote.festivalQuestion)
    .call();
  const activeArtworkQuestion = await admin.methods
    .questions(vote.artworkQuestion)
    .call();
  if (!activeFestivalQuestion || !activeArtworkQuestion) {
    throw Error('inactive question');
  }
};

const checkFestival = async (vote) => {
  const valid = await isActiveFestival(vote.festival);
  if (!valid) {
    throw Error('invalid festival');
  }
};

const checkNonce = async (vote) => {
  const isValidNonce = await admin.methods
    .isValidVotingNonce(vote.booth, vote.nonce)
    .call();
  if (!isValidNonce) {
    throw Error('invalid nonce');
  }
};

const checkSigs = async (vote) => {
  if (
    !isSignatureValid(
      packVote(
        vote.festivalAnswers.map((a) => a.id),
        vote.festivalVoteTokens,
        vote.artworkAnswers.map((a) => a.id),
        vote.artworkVoteTokens,
      ),
      vote.signature,
      vote.sender,
    ) ||
    !isSignatureValid(
      packBooth(
        vote.festivalAnswers.map((a) => a.id),
        vote.nonce,
      ),
      vote.boothSignature,
      vote.booth,
    )
  ) {
    throw Error('invalid sig');
  }
};

const checkMaxVotes = async (answers, votes, question) => {
  const seen = {};
  const maxVoteTokens = await question.methods.maxVoteTokens().call();
  let sum = 0;
  await Promise.all(
    answers.map(async (answer) => {
      if (seen[answer.id]) {
        throw Error('repeated answer');
      }
      seen[answer.id] = true;
      sum += votes;

      const a = await question.methods.getAnswer(answer.chainId).call();
      if (a[0] !== true) {
        throw Error('invalid answer');
      }
    }),
  );
  if (sum > maxVoteTokens * answers.length) {
    throw Error('too many votes');
  }
};

const checkAnswers = async (vote, festivalQuestion, artworkQuestion) => {
  if (vote.festivalAnswers.length !== vote.festivalVoteTokens.length) {
    throw Error('wrong array length');
  }
  if (vote.artworkAnswers.length !== vote.artworkVoteTokens.length) {
    throw Error('wrong array length');
  }
  await checkMaxVotes(
    vote.festivalAnswers,
    vote.festivalVotes,
    festivalQuestion,
  );
  await checkMaxVotes(vote.artworkAnswers, vote.artworkVotes, artworkQuestion);
};

export default async function (req, res, next) {
  const vote = req.body;
  const festivalQuestion = getQuestionContract(vote.festivalQuestion);
  const artworkQuestion = getQuestionContract(vote.artworkQuestion);
  try {
    await checkSigs(vote);
    await checkBooth(vote, festivalQuestion);
    await checkBooth(vote, artworkQuestion);
    await checkNonce(vote);
    await checkChainHasVoted(vote, festivalQuestion, artworkQuestion);
    await checkLocalHasVoted(vote);
    await checkQuestions(vote);
    await checkFestival(vote);
    await checkArtworkQuestionIsHighestVoted(vote);
    await checkAnswers(vote, festivalQuestion, artworkQuestion);
    next();
  } catch (err) {
    next(new APIError(httpStatus.BAD_REQUEST));
  }
}
