import httpStatus from 'http-status';

import { respondWithError, respondWithSuccess } from '~/server/helpers/respond';
import { signBooth } from '~/common/services/vote';

async function read(req, res) {
  const hotspotAddress = process.env.HOTSPOT_ADDRESS;
  const hotspotPrivKey = process.env.HOTSPOT_PRIV_KEY;
  const hotspotFestivalQuestion = process.env.HOTSPOT_FESTIVAL;
  //const hotspotMaxVotes = process.env.HOTSPOT_MAX_VOTES;

  if (!hotspotPrivKey || !hotspotAddress || !hotspotFestivalQuestion) {
    respondWithError(res, { message: 'Unauthorized' }, httpStatus.UNAUTHORIZED);
  }

  const nonce = 0;
  const festivalAnswerIds = [];

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
