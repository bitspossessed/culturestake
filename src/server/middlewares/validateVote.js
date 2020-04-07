import httpStatus from 'http-status';

import { isSignatureValid } from '~/server/services/crypto';
import { packVote, packBooth } from '~/common/services/encoding';
import {
  getQuestionContract,
  getAdminContract,
} from '~/common/services/contracts';
import APIError from '~/server/helpers/errors';

const admin = getAdminContract(process.env.ADMIN_CONTRACT);

const checkBooth = async (vote, question) => {
  const booth = await admin.methods.getVotingBooth(vote.booth).call();
  const festival = await question.methods.festival().call();
  vote.festival = festival;
  if (!booth[0] || festival !== booth[1]) {
    throw Error('invalid booth');
  }
};

const checkHasVoted = async (vote, question) => {
  const hasVoted = await question.methods.hasVoted(vote.sender).call();
  if (hasVoted) {
    throw Error('has voted');
  }
};

const checkQuestion = async vote => {
  const active = await admin.methods.questions(vote.question).call();
  if (!active) {
    throw Error('inactive question');
  }
};

const checkFestival = async vote => {
  const valid = await admin.methods.isValidFestival(vote.festival).call();
  if (!valid) {
    throw Error('invalid festival');
  }
};

const checkNonce = async vote => {
  const isValidNonce = await admin.methods
    .isValidVotingNonce(vote.booth, vote.nonce)
    .call();
  if (!isValidNonce) {
    throw Error('invalid nonce');
  }
};

const checkSigs = async vote => {
  if (
    !isSignatureValid(
      packVote(
        vote.answers.map(a => a.clientId),
        vote.voteTokens,
      ),
      vote.signature,
      vote.sender,
    ) ||
    !isSignatureValid(
      packBooth(
        vote.answers.map(a => a.clientId),
        vote.nonce,
      ),
      vote.boothSignature,
      vote.booth,
    )
  ) {
    throw Error('invalid sig');
  }
};

const checkAnswers = async (vote, question) => {
  if (vote.answers.length !== vote.voteTokens.length) {
    throw Error('wrong array length');
  }
  const seen = {};
  const maxVoteTokens = await question.methods.maxVoteTokens().call();
  let sum = 0;
  await Promise.all(
    vote.answers.map(async answer => {
      if (seen[answer.clientId]) {
        throw Error('repeated answer');
      }
      seen[answer.clientId] = true;
      sum += vote.votes;

      const a = await question.methods.getAnswer(answer.chainId).call();
      if (a[0] !== true) {
        throw Error('invalid answer');
      }
    }),
  );
  if (sum > maxVoteTokens * vote.answers.length) {
    throw Error('too many votes');
  }
};

export default async function(req, res, next) {
  const vote = req.body;
  const question = getQuestionContract(vote.question);
  try {
    await checkSigs(vote, question);
    await checkBooth(vote, question);
    await checkNonce(vote);
    await checkHasVoted(vote, question);
    await checkQuestion(vote);
    await checkFestival(vote);
    await checkAnswers(vote, question);
    vote.answers = vote.answers.map(a => a.chainId);
  } catch (err) {
    throw new APIError(httpStatus.BAD_REQUEST);
  }
  next();
}
