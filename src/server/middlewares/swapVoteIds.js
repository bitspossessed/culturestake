import httpStatus from 'http-status';

import Answers from '~/server/models/answer';
import APIError from '~/server/helpers/errors';

export default async function(req, res, next) {
  const vote = req.body;
  try {
    vote.answers = await Promise.all(
      vote.answers.map(async answer => {
        const a = await Answers.findOne({ where: { clientId: answer } });
        if (!a) {
          throw Error();
        }
        return { clientId: answer, chainId: a.chainId };
      }),
    );
  } catch (err) {
    throw new APIError(httpStatus.BAD_REQUEST);
  }
  next();
}
