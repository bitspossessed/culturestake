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
  const booth = await admin.methods.getVotingBooth(vote.booth);
  const festival = await question.methods.festival().call();
  if (!booth[0] || festival !== booth[1]) {
    throw Error();
  }
};

const checkQuestion = async (vote, question) => {
  const hasVoted = await question.methods.hasVoted(vote.sender).call();
  if (hasVoted) {
    throw Error();
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
  const votesPer = await question.methods.votesPer().call();
  let sum = 0;
  vote.answers.map(answer => {
    if (seen[answer]) {
      throw Error();
    }
    seen[answer] = true;
    sum += vote.votes;
    checks.push(
      new Promise(res => {
        question.methods
          .getAnswer(answer)
          .call()
          .then(a => {
            if (a[0] !== true) {
              throw Error();
            }
            res();
          });
      }),
    );
    if (sum > votesPer * vote.answers.length) {
      throw Error();
    }
    return Promise.all(checks);
  });
};

export default async function(req, res, next) {
  const vote = req.body;
  const question = getQuestionContract(vote.question);
  try {
    checkSigs(vote, question);
    checkBooth(vote);
    checkQuestion(vote);
    checkAnswers(vote);
  } catch (err) {
    throw new APIError(httpStatus.BAD_REQUEST);
  }
  next();
}
