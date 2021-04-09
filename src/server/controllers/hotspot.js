import httpStatus from 'http-status';

import { respondWithError, respondWithSuccess } from '~/server/helpers/respond';
import { signBooth } from '~/common/services/vote';
import { isVotingBoothInitialized } from '~/common/services/contracts/booths';
import Answers from '~/server/models/answer';
import { incrementInRedis, setInRedis } from '~/server/services/redis';

async function read(req, res) {
  const hotspotAddress = process.env.HOTSPOT_ADDRESS;
  const hotspotPrivKey = process.env.HOTSPOT_PRIV_KEY;
  const hotspotFestivalQuestion = parseInt(
    process.env.HOTSPOT_FESTIVAL_QUESTION,
  );
  const hotspotMaxVotes = process.env.HOTSPOT_MAX_VOTES;

  let nonce = await incrementInRedis(`nonce:${hotspotAddress}`);
  if (!nonce) {
    nonce = 0;
    await setInRedis(`nonce:${hotspotAddress}`, nonce);
  } else {
    nonce = parseInt(nonce);
  }

  // cannot vote if the basic variables are not set
  if (
    !hotspotPrivKey ||
    !hotspotAddress ||
    !hotspotFestivalQuestion ||
    !hotspotMaxVotes
  ) {
    return respondWithError(
      res,
      { message: 'Unauthorized' },
      httpStatus.UNAUTHORIZED,
    );
  }

  const isInitialized = await isVotingBoothInitialized(hotspotAddress);

  // the signature supplied by this endpoint will not be valid if the booth isn't initalized
  if (!isInitialized) {
    return respondWithError(
      res,
      { message: 'Unauthorized' },
      httpStatus.UNAUTHORIZED,
    );
  }

  // this is a basic safety check, to limit the damage if this endpoint were being abused
  if (nonce > hotspotMaxVotes) {
    return respondWithError(
      res,
      { message: 'Unprocessable' },
      httpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  // for hotspot votes, we assume all answers were/could be seen by the voter
  const answers = await Answers.findAll({
    where: { questionId: hotspotFestivalQuestion },
  });

  const festivalAnswerIds = answers.map((answer) => answer.id);

  const voteData = {
    booth: hotspotAddress,
    boothSignature: signBooth({
      festivalAnswerIds,
      privateKey: hotspotPrivKey,
      nonce,
    }),
    nonce,
    festivalAnswerIds,
    festivalQuestionId: hotspotFestivalQuestion,
  };

  return respondWithSuccess(res, voteData);
}

export default {
  read,
};
