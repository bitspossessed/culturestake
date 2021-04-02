import httpStatus from 'http-status';

import { respondWithError, respondWithSuccess } from '~/server/helpers/respond';
import { signBooth } from '~/common/services/vote';
import Answers from '~/server/models/answer';

async function read(req, res) {
  const hotspotAddress = process.env.HOTSPOT_ADDRESS;
  const hotspotPrivKey = process.env.HOTSPOT_PRIV_KEY;
  const hotspotFestivalQuestion = process.env.HOTSPOT_FESTIVAL_QUESTION;
  const hotspotMaxVotes = process.env.HOTSPOT_MAX_VOTES;
  const nonce = 0;

  if (!hotspotPrivKey || !hotspotAddress || !hotspotFestivalQuestion) {
    respondWithError(res, { message: 'Unauthorized' }, httpStatus.UNAUTHORIZED);
  }

  if (nonce > hotspotMaxVotes) {
    respondWithError(
      res,
      { message: 'Unprocessable' },
      httpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  const answers = await Answers.find({
    where: { questionId: hotspotFestivalQuestion },
  });

  const festivalAnswerIds = answers.map((answer) => answer.id);

  const voteData = {
    booth: hotspotAddress,
    boothSignature: signBooth(),
    nonce,
    festivalAnswerIds,
    festivalQuestionId: hotspotFestivalQuestion,
  };
  return respondWithSuccess(res, voteData);
}

export default {
  read,
};
