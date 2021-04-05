import httpStatus from 'http-status';

import Invitation from '~/server/models/invitation';
import { filterResponseFields } from '~/server/controllers';
import { invitationFields } from '~/server/database/associations';
import { getFromRedis, expireFromRedis } from '~/server/services/redis';
import { respondWithError, respondWithSuccess } from '~/server/helpers/respond';

const options = {
  model: Invitation,
  fields: invitationFields,
};

function decodeKey(key) {
  const split = key.split(':');
  if (split.length !== 2) {
    throw new Error('Unprocessable key');
  }
  return { email: split[0], festivalSlug: split[1] };
}

async function read(req, res) {
  try {
    const key = await getFromRedis(req.params.token);
    if (!key) {
      return respondWithError(
        res,
        { message: 'No vote invitation found' },
        httpStatus.NOT_FOUND,
      );
    }

    await expireFromRedis(req.params.token);

    const { email, festivalSlug } = decodeKey(key);
    const invitation = await Invitation.findOne({
      where: {
        email,
        festivalSlug,
      },
    });

    const filteredResults = filterResponseFields(req, invitation, {
      ...options,
    });

    return respondWithSuccess(res, filteredResults);
  } catch (error) {
    return respondWithError(res, error, httpStatus.UNPROCESSABLE_ENTITY);
  }
}

export default {
  read,
};
