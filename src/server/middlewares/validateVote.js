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
  if (!booth[0] || festival !== booth[1]) {
    throw Error();
  }
};

const checkQuestion = async (vote, question) => {
  const hasVoted = await question.methods.hasVoted(vote.sender).call();
  if (hasVoted) {
    throw Error('has voted');
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
      packVote(vote.answers, vote.voteTokens),
      vote.signature,
      vote.sender,
    ) ||
    !isSignatureValid(
      packBooth(vote.answers, vote.nonce),
      vote.boothSignature,
      vote.booth,
    )
  ) {
    throw Error();
  }
};

const checkAnswers = async (vote, question) => {
  if (vote.answers.length !== vote.voteTokens.length) {
    throw Error();
  }
  const seen = {};
  const checks = [];
  const maxVoteTokens = await question.methods.maxVoteTokens().call();
  let sum = 0;
  vote.answers.map(async answer => {
    if (seen[answer]) {
      throw Error();
    }
    seen[answer] = true;
    sum += vote.votes;
    checks.push(async res => {
      const a = await question.methods.getAnswer(answer).call();
      if (a[0] !== true) {
        throw Error('invalid answer');
      }
      res();
    });
    if (sum > maxVoteTokens * vote.answers.length) {
      throw Error('too many votes');
    }
  });
  return Promise.all(checks.map(check => new Promise(check)));
};

export default async function(req, res, next) {
  const vote = req.body;
  const question = getQuestionContract(vote.question);
  try {
    await checkSigs(vote, question);
    await checkBooth(vote, question);
    await checkNonce(vote);
    await checkQuestion(vote, question);
    await checkAnswers(vote, question);
  } catch (err) {
    throw new APIError(httpStatus.BAD_REQUEST);
  }
  next();
}
