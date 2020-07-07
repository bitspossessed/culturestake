import httpStatus from 'http-status';

import Answers from '~/server/models/answer';
import APIError from '~/server/helpers/errors';

export default async function (req, res, next) {
  const vote = req.body;
  try {
    vote.festivalAnswers = await Promise.all(
      vote.festivalAnswers.map(async (answer) => {
        const a = await Answers.findByPk(answer);
        if (!a) {
          throw Error();
        }
        return { id: answer, chainId: a.chainId };
      }),
    );
    vote.artworkAnswers = await Promise.all(
      vote.artworkAnswers.map(async (answer) => {
        const a = await Answers.findByPk(answer);
        if (!a) {
          throw Error();
        }
        return { id: answer, chainId: a.chainId };
      }),
    );
    next();
  } catch (err) {
    next(new APIError(httpStatus.BAD_REQUEST));
  }
}
